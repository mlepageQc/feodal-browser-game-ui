<template>
  <router-view 
    id="app-spinner"
    name="spinner"
    v-if="!initialized" />
  <router-view
    name="header" />
  <div id="main">
    <router-view
      name="nav" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent  } from 'vue'
import { getItem } from '@/lib/local-storage'
import { MAP_MARGINS_ITEM, MAP_ZOOM_LEVEL } from '@/config/LocalStorageConfig'
import { mapState, mapMutations } from 'vuex'

export default defineComponent({
  computed: {
    ...mapState([
      'initialized'
    ])
  },
  created (): void {
    this.setMapAttributesFromStorage()
  },
  methods: {
    ...mapMutations('map', [
      'setMapMargins',
      'setMapZoomLevel'
    ]),
    setMapAttributesFromStorage (): void {
      const savedMapMargins = getItem(MAP_MARGINS_ITEM)
      
      if (savedMapMargins) {
        this.setMapMargins(JSON.parse(savedMapMargins))
      }

      const savedZoomLevel = getItem(MAP_ZOOM_LEVEL)
      if (savedZoomLevel) {
        this.setMapZoomLevel(parseInt(savedZoomLevel))
      }
    }
  }
})
</script>

<style lang="scss">
  @import './assets/stylesheets/constants.scss';
  @import './assets/stylesheets/reset.scss';

  body {
    margin: 0;
    height: 100vh;
    font-family: $base-font;
    background: white;
  }
  #app {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  #app-spinner {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background: grey;
  }
  #bottom {
    display: flex;
    flex-grow: 1;
  }
  #main {
    display: flex;
    flex-grow: 1;
  }
  main {
    display: flex;
    flex-grow: 1;
    min-width: 0;
  }
</style>
