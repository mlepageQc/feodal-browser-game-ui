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
    data () {
      return {
        mapImage: null,
        mapImageScale: 1,
        cropAtX: 0,
        cropAtY: 0,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0
      }
    },
    mounted () {
      this.setupMap()
      this.$root.$on('minimap-selection-change', this.onMinimapSelectionChange)
      this.$root.$on('mouseup', this.onMapDragEnd)
    },
    methods: {
      async setupMap () {
        try {
          const response = await this.fetchMapBase64Image()
          this.setMapCanvasImage(response.data)
        } catch (e) {}
      },
      onMinimapSelectionChange ({ newSelectorX, newSelectorY }) {
        const marginLeft = -(newSelectorX / MINIMAP_SIZE * MAP_SIZE)
        const marginTop = -(newSelectorY / MINIMAP_SIZE * MAP_SIZE)

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
        this.dragStartX = event.clientX - this.marginLeft()
        this.dragStartY = event.clientY - this.marginTop()
      },
      onMapDragMove (event) {
        if (!this.isDragging) return false

        let marginLeft = -Math.abs(this.dragStartX - event.clientX)
        let marginTop = -Math.abs(this.dragStartY - event.clientY)

        if (marginLeft > 0) marginLeft = 0
        if (marginTop > 0) marginTop = 0

        this.translateMap(marginLeft, marginTop)

        this.$root.$emit('map-drag', {
          mapMarginLeft: marginLeft,
          mapMarginTop: marginTop,
        })
      },
      marginLeft () {
        let marginLeft = getComputedStyle(this.$refs.mapCanvas).marginLeft
        marginLeft = marginLeft.substr(0, marginLeft.length - 2)
        return Math.round(parseFloat(marginLeft))
      },
      marginTop () {
        let marginTop = getComputedStyle(this.$refs.mapCanvas).marginTop
        marginTop = marginTop.substr(0, marginTop.length - 2)
        return Math.round(parseFloat(marginTop))
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
    display: inline-block;
    overflow: scroll;
    position: relative;
    height: 100%;
    width: 100%;
    &:hover {
      cursor: pointer;
    }
  }
</style>
