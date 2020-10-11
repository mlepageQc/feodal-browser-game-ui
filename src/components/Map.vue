<template>
  <div class="map">
    <canvas ref="mapCanvas" />
  </div>
</template>

<script>
  import axios from 'axios'
  import { MAP_SIZE, MINIMAP_SIZE } from '../config'

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
        mapImageScale: 1,
        cropAtX: 0,
        cropAtY: 0,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        prevMoveX: 0,
        prevMoveY: 0
      }
    },
    mounted () {
      this.setupMap()
      this.$root.$on('minimap:selection-change', this.onMinimapSelectionChange)
      this.$root.$on('app:mouseup', this.onMapDragEnd)
    },
    methods: {
      async setupMap () {
        try {
          const response = await this.fetchMapBase64Image()
          this.setMapCanvasImage(response.data)
        } catch (e) {}
      },
      onMinimapSelectionChange ({ overflowRight, overflowBottom, newSelectorX, newSelectorY }) {
        let marginLeft = -(newSelectorX / MINIMAP_SIZE * MAP_SIZE)
        let marginTop = -(newSelectorY / MINIMAP_SIZE * MAP_SIZE)

        if (overflowRight) {
          marginLeft = this.mapWrapperWidth - this.mapAttribute('width')
        } else if (marginLeft > 0) {
          marginLeft = 0
        }

        if (overflowBottom) {
          marginTop = this.mapWrapperHeight - this.mapAttribute('height')
        } else if (marginTop > 0) {
          marginTop = 0
        }

        this.translateMap(marginLeft, marginTop)
      },
      fetchMapBase64Image () {
        const params = { x: this.cropAtX, y: this.cropAtY }
        return axios({url: 'http://localhost:3000/map', params })
      },
      setMapCanvasImage (base64Image) {
        this.mapImage = new window.Image()
        this.mapImage.onload = () => this.initializeMapCanvas()
        this.mapImage.src = `data:image/png;base64,${base64Image}`
      },
      initializeMapCanvas () {
        const mapCanvas = this.$refs.mapCanvas
        const mapContext = mapCanvas.getContext('2d')

        mapCanvas.width = this.mapImage.width * this.mapImageScale
        mapCanvas.height = this.mapImage.height * this.mapImageScale
        mapContext.drawImage(this.mapImage, 0, 0)

        this.$emit('mounted')
        this.addMapListeners()
      },
      addMapListeners () {
        this.$el.addEventListener('mousedown', this.onMapDragStart)
        this.$el.addEventListener('mousemove', this.onMapDragMove)
        this.$el.addEventListener('mouseup', this.onMapDragEnd)
      },
      onMapDragStart (event) {
        this.isDragging = true
        this.dragStartX = event.clientX - this.mapAttribute('marginLeft')
        this.dragStartY = event.clientY - this.mapAttribute('marginTop')
      },
      onMapDragMove (event) {
        if (!this.isDragging) return false

        this.dragMap(event)
      },
      dragMap (event) {
        let marginLeft = event.clientX - this.dragStartX
        let marginTop = event.clientY - this.dragStartY
        // Overflow flags for right and bottom edge cases
        let overflowRight = false
        let overflowBottom = false

        if (marginLeft > 0) {
        // Overflow left
          marginLeft = 0
        } else if (marginLeft < (this.mapWrapperWidth - this.mapAttribute('width'))) {
        // Overflow right
          marginLeft = this.mapWrapperWidth - this.mapAttribute('width')
          overflowRight = true
        }

        if (marginTop > 0) {
        // Overflow top
          marginTop = 0
        } else if (marginTop < (this.mapWrapperHeight - this.mapAttribute('height'))) {
        // Overflow bottom
          marginTop = this.mapWrapperHeight - this.mapAttribute('height')
          overflowBottom = true
        }

        this.translateMap(marginLeft, marginTop)

        this.$root.$emit('map:drag', {
          overflowRight,
          overflowBottom,
          mapMarginLeft: marginLeft,
          mapMarginTop: marginTop,
        })
      },
      mapAttribute (attribute) {
        let value = getComputedStyle(this.$refs.mapCanvas)[attribute]
        value = value.substr(0, value.length - 2)
        return Math.round(parseFloat(value))
      },
      onMapDragEnd () {
        this.isDragging = false
      },
      translateMap (marginLeft, marginTop) {
        this.$refs.mapCanvas.style.marginLeft = `${marginLeft}px`
        this.$refs.mapCanvas.style.marginTop = `${marginTop}px`
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
  }
</style>
