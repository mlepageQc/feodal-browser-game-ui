<template>
  <div class="minimap">
    <div v-show="selectorMounted" class="minimap__selector" ref="minimapSelector" />
    <canvas ref="minimapCanvas" />
  </div>
</template>

<script>
  import axios from 'axios'
  import { MAP_SIZE, MINIMAP_SIZE } from '../config'

  export default {
    name: 'minimap',
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
        minimapImage: null,
        isDragging: false,
        dragStartX: 0,
        dragStartY: 0,
        selectorMounted: false
      }
    },
    mounted () {
      this.setupMinimap()
      this.$root.$on('app:mouseup', this.onMinimapSelectionEnd)
      this.$root.$on('map:drag', this.onMapDrag)
    },
    methods: {
      async setupMinimap () {
        try {
          const response = await this.fetchMinimapBase64Image()
          this.setMinimapCanvasImage(response.data)
        } catch (e) {}
      },
      fetchMinimapBase64Image () {
        return axios({ url: 'http://localhost:3000/minimap' })
      },
      setMinimapCanvasImage (base64Image) {
        this.minimapImage = new window.Image()
        this.minimapImage.onload = () => this.initializeMinimapCanvas()
        this.minimapImage.src = `data:image/png;base64,${base64Image}`
      },
      initializeMinimapCanvas () {
        const minimapCanvas = this.$refs.minimapCanvas
        const minimapContext = minimapCanvas.getContext('2d')

        minimapCanvas.width = MINIMAP_SIZE
        minimapCanvas.height = MINIMAP_SIZE
        minimapContext.drawImage(this.minimapImage, 0, 0)

        this.setupMinimapSelector()
      },
      setupMinimapSelector () {
        const selectorWidth = Math.round(this.mapWrapperWidth / MAP_SIZE * MINIMAP_SIZE)
        const selectorHeight = Math.round(this.mapWrapperHeight / MAP_SIZE * MINIMAP_SIZE)

        this.$refs.minimapSelector.style.height = `${selectorHeight}px`
        this.$refs.minimapSelector.style.width = `${selectorWidth}px`

        this.$el.addEventListener('mousedown', this.onMinimapSelectionStart)
        this.$el.addEventListener('mousemove', this.onMinimapSelectionMove)
        this.$el.addEventListener('mouseup', this.onMinimapSelectionEnd)
        this.selectorMounted = true
      },
      onMapDrag ({ mapMarginLeft, mapMarginTop }) {
        const newX = -mapMarginLeft / MAP_SIZE * MINIMAP_SIZE
        const newY = -mapMarginTop / MAP_SIZE * MINIMAP_SIZE
        this.translateMinimapSelector(newX, newY)
      },
      onMinimapSelectionStart (event) {
        this.isDragging = true
        this.moveSelector(event)
      },
      onMinimapSelectionMove (event) {
        if (!this.isDragging) return true

        this.moveSelector(event)
      },
      onMinimapSelectionEnd () {
        this.isDragging = false
      },
      moveSelector (event) {
        const selector = this.$refs.minimapSelector
        // Flags used for overflow right and bottom
        // Pixel values are not precise enough for map definition
        // These flags will indicate to the map that edges are reached
        let overflowRight = false
        let overflowBottom = false
        // Set X
        let newX = 0
        if (this.willSelectorOverflowRight(event)) {
          newX = MINIMAP_SIZE - this.selectorAttribute('width')
          overflowRight = true
        } else if (!this.willSelectorOverflowLeft(event)) {
          newX =  this.movedSelectorCenterX(event)
        }
        // Set Y
        let newY = 0
        if (this.willSelectorOverflowBottom(event)) {
          newY = MINIMAP_SIZE - this.selectorAttribute('height')
          overflowBottom = true
        } else if (!this.willSelectorOverflowTop(event)) {
          newY = this.movedSelectorCenterY(event)
        }

        this.translateMinimapSelector(newX, newY)

        this.$root.$emit('minimap:selection-change', {
          overflowRight,
          overflowBottom,
          newSelectorX: newX,
          newSelectorY: newY
        })
      },
      translateMinimapSelector (newX, newY) {
        this.$refs.minimapSelector.style.left = `${newX}px`
        this.$refs.minimapSelector.style.top = `${newY}px`
      },
      selectorAttribute (attribute) {
        let value = getComputedStyle(this.$refs.minimapSelector)[attribute]
        value = value.substr(0, value.length - 2)
        return Math.round(parseFloat(value))
      },
      minimapAttribute (attribute) {
        let value = getComputedStyle(this.$el)[attribute]
        value = value.substr(0, value.length - 2)
        return Math.round(parseFloat(value))
      },
      willSelectorOverflowLeft (event) {
        return (event.layerX - this.selectorAttribute('width') / 2) <= 0
      },
      willSelectorOverflowRight (event) {
        return (event.layerX + this.selectorAttribute('width') / 2) >= MINIMAP_SIZE
      },
      willSelectorOverflowTop (event) {
        return (event.layerY - this.selectorAttribute('height') / 2) <= 0
      },
      willSelectorOverflowBottom (event) {
        return (event.layerY + this.selectorAttribute('height') / 2) >= MINIMAP_SIZE
      },
      movedSelectorCenterX (event) {
        return (event.layerX - this.selectorAttribute('width') / 2) - this.selectorAttribute('borderLeftWidth') * 2
      },
      movedSelectorCenterY (event) {
        return (event.layerY - this.selectorAttribute('height') / 2) - this.selectorAttribute('borderTopWidth') * 2
      }
    }
  }
</script>

<style lang="scss">
  .minimap {
    &__selector {
      box-sizing: border-box;
      position: absolute;
      border: 2px solid black;
      background: transparent;
      pointer-events: none;
    }
  }
</style>
