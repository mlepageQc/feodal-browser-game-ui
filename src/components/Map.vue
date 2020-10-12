<template>
  <div class="map">
    <div
      ref="playground"
      class="map__playground"
      @mousemove="hoverTile">
      <div v-show="isTileHovered" class="map__hovered-tile" ref="hoveredTile" />
      <div v-show="selectedTile" class="map__selected-tile" ref="selectedTile" />
      <canvas ref="mapCanvas" />
      <canvas class="map__buildings-canvas" ref="buildingsCanvas" />
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { APP_HEADER_HEIGHT, MAP_SIZE, MINIMAP_SIZE, TILE_SIZE } from '../config'

  export default {
    name: 'map-component',
    props: {
      mapWrapperWidth: {
        type: Number,
        required: true
      },
      mapWrapperHeight: {
        type: Number,
        required: true
      }
    },
    data () {
      return {
        mapImage: null,
        buildingsImage: null,
        mapImageScale: 1,
        isDragging: false,
        initialMarginLeft: 0,
        initialMarginTop: 0,
        isTileHovered: false,
        selectTileOnMouseUp: false,
        selectedTile: null
      }
    },
    mounted () {
      this.setupMap()
      this.$root.$on('minimap:selection-change', this.onMinimapSelectionChange)
      this.$root.$on('app:mouseup', () => this.onAppMouseup)
    },
    methods: {
      async setupMap () {
        try {
          const map_response = await this.fetchMapBase64Image()
          const buildings_response = await this.fetchBuildingsBase64Image()

          this.setMapCanvasImage(map_response.data)
          this.setBuildingsCanvasImage(buildings_response.data)
        } catch (e) {}
      },
      onMinimapSelectionChange ({ overflowRight, overflowBottom, newSelectorX, newSelectorY }) {
        let marginLeft = -(newSelectorX / MINIMAP_SIZE * MAP_SIZE)
        let marginTop = -(newSelectorY / MINIMAP_SIZE * MAP_SIZE)

        if (overflowRight) {
          marginLeft = this.mapWrapperWidth - this.playgroundAttribute('width')
        } else if (marginLeft > 0) {
          marginLeft = 0
        }

        if (overflowBottom) {
          marginTop = this.mapWrapperHeight - this.playgroundAttribute('height')
        } else if (marginTop > 0) {
          marginTop = 0
        }

        this.translateMap(marginLeft, marginTop)
      },
      onAppMouseup () {
        this.isDragging = false
        this.$refs.playground.classList.add('map__playground_with-transition')
      },
      fetchMapBase64Image () {
        return axios({ url: 'http://localhost:3000/map' })
      },
      fetchBuildingsBase64Image () {
        return axios({ url: 'http://localhost:3000/buildings' })
      },
      setMapCanvasImage (mapBase64Image) {
        this.mapImage = new window.Image()
        this.mapImage.onload = () => this.initializeMapCanvas()
        this.mapImage.src = `data:image/png;base64,${mapBase64Image}`
      },
      setBuildingsCanvasImage (buildingsBase64Image) {
        this.buildingsImage = new window.Image()
        this.buildingsImage.onload = () => this.initializeBuildingsCanvas()
        this.buildingsImage.src = `data:image/png;base64,${buildingsBase64Image}`
      },
      initializeMapCanvas () {
        const mapCanvas = this.$refs.mapCanvas
        const mapContext = mapCanvas.getContext('2d')

        const playgroundWidth = this.mapImage.width * this.mapImageScale
        const playgroundHeight = this.mapImage.height * this.mapImageScale

        this.$refs.playground.style.width = `${playgroundWidth}px`
        this.$refs.playground.style.height = `${playgroundHeight}px`

        mapCanvas.width = playgroundWidth
        mapCanvas.height = playgroundHeight
        mapContext.drawImage(this.mapImage, 0, 0)

        this.$emit('mounted')
        this.addMapListeners()
      },
      initializeBuildingsCanvas () {
        const buildingsCanvas = this.$refs.buildingsCanvas
        const buildingsContext = buildingsCanvas.getContext('2d')

        buildingsCanvas.width = this.buildingsImage.width * this.mapImageScale
        buildingsCanvas.height = this.buildingsImage.height * this.mapImageScale
        buildingsContext.drawImage(this.buildingsImage, 0, 0)
      },
      addMapListeners () {
        this.$refs.playground.addEventListener('mousedown', this.onMapMouseDown)
        this.$refs.playground.addEventListener('mousemove', this.onMapMouseMove)
        this.$refs.playground.addEventListener('mouseup', this.onMapMouseUp)
        this.$refs.playground.addEventListener('mouseout', this.onMapMouseOut)
      },
      onMapMouseDown (event) {
        this.$refs.playground.classList.remove('map__playground_with-transition')
        this.isDragging = true

        this.initialClientX = event.clientX
        this.initialClientY = event.clientY

        this.initialMarginLeft = this.playgroundAttribute('marginLeft')
        this.initialMarginTop = this.playgroundAttribute('marginTop')
      },
      dragStartX () {
        return this.initialClientX - this.initialMarginLeft
      },
      dragStartY () {
        return this.initialClientY - this.initialMarginTop
      },
      onMapMouseMove (event) {
        this.hoverTile(event)
        if (!this.isDragging) return false

        this.dragMap(
          event.clientX - this.dragStartX(),
          event.clientY - this.dragStartY()
        )
      },
      onMapMouseUp (event) {
        this.isDragging = false
        // We give an interval in which the dragging will select the tile
        // This is to prevent unconsistent selection behavior
        const movedX = Math.abs(this.dragStartX() - (event.clientX - this.initialMarginLeft)) <= 3
        const movedY = Math.abs(this.dragStartY() - (event.clientY - this.initialMarginTop)) <= 3

        if (movedX || movedY) this.selectTile(event)
      },
      onMapMouseOut (event) {
        this.isTileHovered = false
      },
      hoverTile (event) {
        this.isTileHovered = true

        const hoveredTileLeft = event.layerX - event.layerX % TILE_SIZE
        const hoveredTileTop = event.layerY - event.layerY % TILE_SIZE

        this.$refs.hoveredTile.style.left = `${hoveredTileLeft}px`
        this.$refs.hoveredTile.style.top = `${hoveredTileTop}px`
      },
      selectTile (event) {
        // Get tile information with pixel canvas image, fetch units on this tile
        this.isTileHovered = false
        this.selectedTile = {}
        this.$refs.playground.classList.add('map__playground_with-transition')

        // Setting selected tile disposition
        const selectedTileLeft = event.layerX - event.layerX % TILE_SIZE
        const selectedTileTop = event.layerY - event.layerY % TILE_SIZE
        this.$refs.selectedTile.style.left = `${selectedTileLeft}px`
        this.$refs.selectedTile.style.top = `${selectedTileTop}px`

        // Centering on selected tile
        const marginLeft = -selectedTileLeft + this.mapWrapperWidth / 2 - TILE_SIZE / 2
        const marginTop = -selectedTileTop + this.mapWrapperHeight / 2 - TILE_SIZE / 2
        this.dragMap(marginLeft, marginTop)
      },
      dragMap (marginLeft, marginTop) {
        // Overflow flags for right and bottom edge cases
        let overflowRight = false
        let overflowBottom = false

        if (marginLeft > 0) {
        // Overflow left
          marginLeft = 0
        } else if (marginLeft < (this.mapWrapperWidth - this.playgroundAttribute('width'))) {
        // Overflow right
          marginLeft = this.mapWrapperWidth - this.playgroundAttribute('width')
          overflowRight = true
        }

        if (marginTop > 0) {
        // Overflow top
          marginTop = 0
        } else if (marginTop < (this.mapWrapperHeight - this.playgroundAttribute('height'))) {
        // Overflow bottom
          marginTop = this.mapWrapperHeight - this.playgroundAttribute('height')
          overflowBottom = true
        }

        this.translateMap(marginLeft, marginTop)

        this.$root.$emit('map:drag', {
          overflowRight,
          overflowBottom,
          mapMarginLeft: marginLeft,
          mapMarginTop: marginTop
        })
      },
      translateMap (marginLeft, marginTop) {
        this.$refs.playground.style.marginLeft = `${marginLeft}px`
        this.$refs.playground.style.marginTop = `${marginTop}px`
      },
      playgroundAttribute (attribute) {
        let value = getComputedStyle(this.$refs.playground)[attribute]
        value = value.substr(0, value.length - 2)
        return Math.round(parseFloat(value))
      },
      hoveredTileAttribute (attribute) {
        let value = getComputedStyle(this.$refs.hoveredTile)[attribute]
        value = value.substr(0, value.length - 2)
        return Math.round(parseFloat(value))
      }
    }
  }
</script>

<style lang="scss">
  .map {
    position: relative;
    &:hover {
      cursor: pointer;
    }
    &__playground {
      position: relative;
      margin-left: 0;
      margin-top: 0;
      &_with-transition {
        transition: all 0.5s ease;
      }
    }
    &__buildings-canvas {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      pointer-events: none;
    }
    &__hovered-tile {
      position: absolute;
      top: 0;
      left: 0;
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      pointer-events: none;
    }
    &__selected-tile {
      position: absolute;
      top: 0;
      left: 0;
      width: 32px;
      height: 32px;
      background: blue;
      opacity: 0.2;
      border-radius: 8px;
      pointer-events: none;
      transition: opacity .5s;
    }
  }
</style>
