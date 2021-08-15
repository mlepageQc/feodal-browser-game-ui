<template>
  <div class="map">
    <div 
      class="map--display"
      ref="map_container" />
    <router-view class="map--tile" />
	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { fetchMapBase64Image, fetchMinimapBase64Image } from '@/api/MapApi'
import Map from '@/lib/map/Map'

export default defineComponent({
  mounted (): void {
    this.initializeMap()
  },
  methods: {
    initializeMap (): void {
      const map: Map = new Map(
        this.$refs.map_container as HTMLDivElement,
        fetchMapBase64Image,
        fetchMinimapBase64Image,
        () => null,
        0
      )
      map.setup()
      map.mount()
    }
  }
})
</script>

<style lang="scss">
  .map {
    display: flex;
    &--display {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 56px;
      flex: 5;
    }
    &--tile {
      flex: 2; 
    }
  }
</style>
