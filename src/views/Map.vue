<template>
  <div class="app-map" v-show="map">
    <div
      class="map--container"
      ref="mapContainer" />
    <router-view v-if="map" class="map--tile" />
  </div>
</template>

<script lang="ts">
import { CoordinatesSet } from '@/lib/map/types'
import { defineComponent } from 'vue'
import { debounce } from 'lodash'
import { fetchMapBase64Image, fetchMinimapBase64Image } from '@/api/MapApi'
import { mapState, mapMutations } from 'vuex'
import { setItem } from '@/lib/local-storage'
import Map from '@/lib/map/Map'
import { TILE_SIZE } from '@/lib/map/config'
import RouteNames from '@/config/RouteNames'
import { MAP_MARGINS_ITEM } from '@/config/LocalStorageConfig'

export default defineComponent({
  computed: { 
    ...mapState('session', [
      'currentUser'
    ]),
    ...mapState('map', [
      'map',
      'mapMarginLeft',
      'mapMarginTop'
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
      'setMapMargins'
    ]),
    async initializeMap (): Promise<void> {
      const base64Strings = await Promise.all([
        fetchMapBase64Image(0),
        fetchMinimapBase64Image()
      ])

      this.setMap(new Map(
        this.$refs.mapContainer as HTMLDivElement,
        base64Strings[0].data,
        base64Strings[1].data,
        this.onMapSelectionChange,  
        this.onMapDragged,
        0
      ))

      window.addEventListener('resize', this.reCenterDebounce)
      this.map.dragMap(this.mapMarginLeft, this.mapMarginTop)
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
    onMapDragged (marginLeft: number, marginTop: number): void {
      setItem(MAP_MARGINS_ITEM, JSON.stringify({ marginLeft, marginTop }))
      this.setMapMargins({ marginLeft, marginTop })
    },
    // eslint-disable-next-line no-unused-vars
    reCenterDebounce: debounce(function(this: any, _e: any) { 
      this.map.reCenter()
    }, 200)
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
