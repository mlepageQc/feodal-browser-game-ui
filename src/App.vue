<template>
  <div
    class="app"
    @mouseup="$root.$emit('app:mouseup', $event)">
    <header class="app__header">
      This is a game
    </header>
    <main>
      <div class="app__map-wrapper" ref="mapWrapper">
        <map-component
          :mapWrapperWidth="mapWrapperWidth"
          :mapWrapperHeight="mapWrapperHeight"
          @mounted="onMapMounted" />
      </div>
        <minimap
          v-if="mapMounted"
          class="app__minimap"
          :mapWrapperWidth="mapWrapperWidth"
          :mapWrapperHeight="mapWrapperHeight" />
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
        this.setMapWrapperDimensions()
        window.onresize = this.onWindowResize
        this.mapMounted = true
      },
      setMapWrapperDimensions () {
        this.mapWrapperWidth = this.mapWrapperAttribute('width')
        this.mapWrapperHeight = this.mapWrapperAttribute('height')
      },
      onWindowResize () {
        this.onMapResize()
        // Do other stuff
      },
      onMapResize () {
        this.setMapWrapperDimensions()
        this.$root.$emit('map:resize')
      },
      mapWrapperAttribute (attribute) {
        let value = getComputedStyle(this.$refs.mapWrapper)[attribute]
        value = value.substr(0, value.length - 2)
        return Math.round(parseFloat(value))
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
      font-family: 'Comic Sans MS';
      font-size: 20px;
      box-sizing: border-box;
    }
    main {
      display: flex;
      height: calc(100vh - 60px);
      position: relative;
    }
    &__map-actions {
      flex: 1;
      flex-grow: 1;
      min-width: 250px;
      border-left: 1px solid black;
    }
    &__map-wrapper {
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
