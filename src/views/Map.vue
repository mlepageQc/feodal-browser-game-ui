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
import { fetchMapBase64Image, fetchMinimapBase64Image } from '@/api/MapApi'
import { mapState, mapMutations } from 'vuex'
import Map from '@/lib/map/Map'
import { TILE_SIZE } from '@/lib/map/config'

export default defineComponent({
  mounted (): void {
    this.initializeMap()
  },
  beforeRouteUpdate (to, _from, next) {
    if (to.name === 'map') {
      window.setTimeout(() => {
        this.map!.reCenter()       
      }, 0)
    }
    next()
  },
  computed: { 
    ...mapState('session', [
      'currentUser'
    ]),
    ...mapState([
      'map'
    ])
  },
  methods: {
    ...mapMutations([
      'setMap'
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
        0
      ))
    },
    onMapSelectionChange ({ x, y }: CoordinatesSet): void {
      this.$router.push({ 
        name: 'tile', 
        query: { 
          x: x / TILE_SIZE, 
          y: y / TILE_SIZE 
        } 
      })
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
    .map {
      &--container {
        overflow: hidden;
        flex-grow: 1;
        position: relative;
        flex: 6
      }
    }
  }
</style>
