<template>
  <div class="app-map">
    <div
      class="map--container"
      ref="mapContainer" />
    <router-view v-if="map" class="map--tile" />
  </div>
</template>

<script lang="ts">
import { CoordinatesSet, MapImageParams } from '@/lib/map/types'
import { defineComponent } from 'vue'
import { debounce } from 'lodash'
import { fetchMapBase64Image } from '@/api/MapApi'
import { mapState, mapMutations, mapGetters } from 'vuex'
import { setItem } from '@/lib/local-storage'
import { ImageParams } from '@/types/ImageParams'
import Map from '@/lib/map/Map'
import { TILE_SIZE } from '@/lib/map/config'
import RouteNames from '@/config/RouteNames'
import { MAP_MARGINS_ITEM } from '@/config/LocalStorageConfig'
import { AxiosResponse } from 'axios'
import { MAP_IMAGE_SIZE } from '@/config/Map'

export default defineComponent({
  computed: { 
    ...mapState('session', [
      'currentUser'
    ]),
    ...mapState('map', [
      'map',
      'mapMarginLeft',
      'mapMarginTop',
      'zoomLevel',
      'fetchedImagesData'
    ]),
    ...mapGetters('map', [
      'mapSize'
    ])
  },
  beforeRouteUpdate (to, _from, next) {
    if (to.name === RouteNames.Map) {
      window.setTimeout(() => { this.map.reCenter() }, 0)
    }
    next()
  },
  mounted (): void {
    this.initializeMap()   
  },
  beforeUnmount () {
    window.removeEventListener('resize', this.reCenterDebounce)
  },
  methods: {
    ...mapMutations('map', [
      'setMap',
      'setMapMargins',
      'addFetchedImagesData'
    ]),
    async initializeMap (): Promise<void> {
      const imagesParams = this.buildImagesFetchingParams()

      const mapImagesResponse = await Promise.all<AxiosResponse<MapImageParams>>(
        imagesParams.map((params: ImageParams) => fetchMapBase64Image(params))
      )

      const mapImagesData = mapImagesResponse.map(response => response.data)

      this.addFetchedImagesData(mapImagesData)

      this.setMap(new Map(
        this.$refs.mapContainer as HTMLDivElement,
        mapImagesData,
        this.onMapSelectionChange,  
        this.onMapDragged,
        this.mapSize
      ))

      // // window.addEventListener('resize', this.reCenterDebounce)
      // this.map.dragMap(this.mapMarginLeft, this.mapMarginTop)
    },
    onMapSelectionChange ({ x, y }: CoordinatesSet): void {
      this.$router.push({ 
        name: RouteNames.Tile, 
        query: { 
          x: x / TILE_SIZE,   
          y: y / TILE_SIZE 
        } 
      })
    },
    async onMapDragged (marginLeft: number, marginTop: number): Promise<void> {
      setItem(MAP_MARGINS_ITEM, JSON.stringify({ marginLeft, marginTop }))
      this.setMapMargins({ marginLeft, marginTop })

      const imagesParams = this.buildImagesFetchingParams()

      const mapImagesResponse = await Promise.all<AxiosResponse<MapImageParams>>(
        imagesParams.map((params: ImageParams) => fetchMapBase64Image(params))
      )

      const mapImagesData = mapImagesResponse.map(response => response.data)

      this.addFetchedImagesData(mapImagesData)

      mapImagesData.forEach(imageData => {
        this.map.renderImage(imageData)
      })

      this.map.mapImagesParams = this.fetchedImagesData
      this.map.mount()
    },
    // eslint-disable-next-line no-unused-vars
    reCenterDebounce: debounce(function(this: any, _e: any) { 
      this.map.reCenter()
    }, 200),
    startingImageX (): number {
      return Math.floor(Math.abs(this.mapMarginLeft) / MAP_IMAGE_SIZE) * MAP_IMAGE_SIZE
    },
    startingImageY (): number {
      return Math.floor(Math.abs(this.mapMarginTop) / MAP_IMAGE_SIZE) * MAP_IMAGE_SIZE
    },
    endingImageX (): number {
      return Math.floor(
        (Math.abs(this.mapMarginLeft) + (this.$refs.mapContainer as HTMLDivElement).offsetWidth) / MAP_IMAGE_SIZE
      ) * MAP_IMAGE_SIZE
    },
    endingImageY (): number {
      return Math.floor(
        (Math.abs(this.mapMarginTop) + (this.$refs.mapContainer as HTMLDivElement).offsetHeight) / MAP_IMAGE_SIZE
      ) * MAP_IMAGE_SIZE
    },
    buildImagesFetchingParams (): ImageParams[] {
      const imageParams = []
      // Adding every image params that will fill the screen
      for (let i = this.startingImageX(); i <= this.endingImageX(); i += MAP_IMAGE_SIZE) {
        for(let j = this.startingImageY(); j <= this.endingImageY(); j += MAP_IMAGE_SIZE) {
          // Not adding params if they are already cached
          const alreadyFetched = (this.fetchedImagesData as ImageParams[]).find(fetchedParams => {
            return fetchedParams.x === i && fetchedParams.y === j
          })
          if (!alreadyFetched) {
            imageParams.push({
              x: i,
              y: j,
              zoomLevel: this.zoomLevel
            })
          }       
        }
      }

      return imageParams
    }
  }
})
</script>

<style lang="scss">
  @import '../lib/map/style/map.scss';
  @import '../lib/map/style/minimap.scss';

  .app-map {
    display: flex;
    flex-grow: 1;
    min-width: 0;
  }
</style>
