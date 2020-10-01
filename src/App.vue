<template>
  <div
    class="app"
    @mouseup="$root.$emit('mouseup')">
    <header class="app__header">
      This is a game
    </header>
    <main>
      <div class="app__map-wrapper" ref="mapWrapper">
        <map-component @mounted="onMapMounted" />
        <minimap
          v-if="mapMounted"
          class="app__minimap"
          :mapWrapperWidth="mapWrapperWidth"
          :mapWrapperHeight="mapWrapperHeight" />
      </div>
      <div class="app__map-actions" />
    </main>
  </div>
</template>

<script>
  import MapComponent from './components/Map'
  import Minimap from './components/Minimap'

  export default {
    name: 'App',
    components: {
      MapComponent,
      Minimap
    },
    data () {
      return {
        mapMounted: false,
        mapWrapperWidth: 0,
        mapWrapperHeight: 0
      }
    },
    methods: {
      onMapMounted () {
        this.mapWrapperWidth = this.$refs.mapWrapper.offsetWidth
        this.mapWrapperHeight = this.$refs.mapWrapper.offsetHeight
        this.mapMounted = true
      }
    }
  }
</script>

<style lang="scss">
  body {
    margin: 0;
    overflow-y: hidden;
    min-width: 1024px;
  }

  .app {
    header {
      height: 60px;
      padding: 0 24px;
      border-bottom: 1px solid black;
      display: flex;
      align-items: center;
    }
    main {
      display: flex;
      height: calc(100vh - 60px);
    }
    &__map-actions {
      flex: 1;
      min-width: 250px;
      border-left: 1px solid black;
    }
    &__map-wrapper {
      flex-grow: 6;
      max-width: 80%;
      overflow: hidden;
      position: relative;
    }
    &__minimap {
      position: absolute;
      right: 24px;
      bottom: 24px;
      width: 280px;
      height: 280px;
      border: 5px solid black;
    }
  }
</style>
