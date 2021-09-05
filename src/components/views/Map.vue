<template>
  <div class="app-map" v-show="map">
    <div 
      class="map--container"
      ref="map_container" />
    <router-view class="map--tile" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { fetchMapBase64Image, fetchMinimapBase64Image } from '@/api/MapApi'
import Map from '@/lib/map/Map'

export default defineComponent({
  data () {
    return {
      map: null as null | Map
    }
  },
  mounted (): void {
    this.initializeMap()
  },
  methods: {
    initializeMap (): void {
      this.map = new Map(
        this.$refs.map_container as HTMLDivElement,
        fetchMapBase64Image,
        fetchMinimapBase64Image,
        ({ x, y }) => this.$router.push({ name: 'tile', query: { x, y } }),
        0
      )
    }
  }
})
</script>

<style lang="scss">
  @import '../../lib/map/style/map.scss';
  @import '../../lib/map/style/minimap.scss';

  .app-map {
    display: flex;
    flex-grow: 1;
    .map{
      &--container {
        position: relative;
        flex: 6
      }
    }
  }
</style>
