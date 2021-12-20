<template>
  <div class="app-map">
    <div
      class="map--container"
      ref="mapContainer" />
    <router-view v-if="map" class="map--tile" />
  </div>
</template>

<script lang="ts">
import { CoordinatesSet, ImageData, ImageParams } from '@/lib/map/types'
import { defineComponent } from 'vue'
import { debounce } from 'lodash'
import { fetchMapBase64Image } from '@/api/MapApi'
import { mapActions, mapState, mapMutations, mapGetters } from 'vuex'
import { setItem } from '@/lib/local-storage'
import Map from '@/lib/map/Map'
import RouteNames from '@/config/RouteNames'
import { MAP_MARGINS_ITEM } from '@/config/LocalStorageConfig'
import { AxiosResponse } from 'axios'
import { MAP_IMAGE_SIZE, TILE_SIZE } from '@/config/Map'

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
    this.destroyMap()
  },
  methods: {
    ...mapMutations('map', [
      'setMap',
      'setMapMargins',
      'addFetchedImagesData'
    ]),
    ...mapActions('map', {
      destroyMap: 'destroy'
    }),
    async initializeMap (): Promise<void> {
      const map = new Map(
        this.$refs.mapContainer as HTMLDivElement,
        this.onMapSelectionChange,  
        this.onMapDragged,
        this.mapSize,
        TILE_SIZE
      )
      this.setMap(map)
      window.addEventListener('resize', this.reCenterDebounce)
      this.map.drawImages(await this.updateMapImages())
      this.map.mount()
      this.map.translateMap(this.mapMarginLeft, this.mapMarginTop) // Moving to cached coordinates
    },
    // eslint-disable-next-line no-unused-vars
    reCenterDebounce: debounce(async function(this: any, _e: any) { 
      this.map.reCenter()
      this.map.drawImages(await this.updateMapImages())
    }, 200),
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
      this.map.drawImages(await this.updateMapImages())
    },
    // Retrieves needed images parameters, fetches the images, adds them to store caching and returns them
    async updateMapImages (): Promise<ImageData[]> {
      const imagesParams = this.buildImagesFetchingParams()
      const imagesResponse = await Promise.all<AxiosResponse<ImageData>>(
        imagesParams.map((params: ImageParams) => fetchMapBase64Image(params))
      )
      const imagesData = imagesResponse.map(response => response.data)
      this.addFetchedImagesData(imagesData)
      return imagesData
    },
    buildImagesFetchingParams (): ImageParams[] {
      const imageParams = []
      // Adding every image params that will fill the screen
      for (let i = this.startingImageX(); i <= this.endingImageX() && i < this.mapSize; i += MAP_IMAGE_SIZE) {
        for(let j = this.startingImageY(); j <= this.endingImageY() && j < this.mapSize; j += MAP_IMAGE_SIZE) {
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
    },
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
