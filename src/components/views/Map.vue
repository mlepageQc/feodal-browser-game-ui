<template>
  <div class="app-map">
    <div
      class="map--container"
      ref="mapContainer" />
    <router-view class="map--tile" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { initializeMap } from '@/map'

export default defineComponent({
  mounted (): void {
    initializeMap(this.$refs.mapContainer as HTMLDivElement)
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
