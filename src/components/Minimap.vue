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
      this.$root.$on('mouseup', () => this.isDragging = false)
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
        const selectorWidth = this.mapWrapperWidth / MAP_SIZE * MINIMAP_SIZE
        const selectorHeight = this.mapWrapperHeight / MAP_SIZE * MINIMAP_SIZE

        this.$refs.minimapSelector.style.height = `${selectorHeight}px`
        this.$refs.minimapSelector.style.width = `${selectorWidth}px`

        this.$el.addEventListener('mousedown', this.onMinimapSelectionStart)
        this.$el.addEventListener('mousemove', this.onMinimapSelectionMove)
        this.$el.addEventListener('mouseup', this.onMinimapSelectionEnd)
        this.selectorMounted = true
      },
      onMinimapSelectionStart (event) {
        this.isDragging = true
        this.moveSelector(event)
      },
      onMinimapSelectionMove (event) {
        if (!this.isDragging) return true

        this.moveSelector(event)
      },
      onMinimapSelectionEnd (event) {
        this.isDragging = false
      },
      moveSelector (event) {
        const selector = this.$refs.minimapSelector
        // Set X
        let newX = 0
        if (this.willSelectorOverflowRight(event)) {
          newX = MINIMAP_SIZE - this.selectorWidth()
        } else if (!this.willSelectorOverflowLeft(event)) {
          newX =  this.movedSelectorCenterX(event)
        }
        selector.style.left = `${newX}px`
        // Set Y
        let newY = 0
        if (this.willSelectorOverflowBottom(event)) {
          newY = MINIMAP_SIZE - this.selectorHeight()
        } else if (!this.willSelectorOverflowTop(event)) {
          newY = this.movedSelectorCenterY(event)
        }
        selector.style.top = `${newY}px`

        this.$root.$emit('minimap-selection-change', {
          newSelectorX: newX,
          newSelectorY: newY
        })
      },
      selectorLeft () {
        let left = getComputedStyle(this.$refs.minimapSelector).left
        left = left.substr(0, left.length - 2)
        return Math.round(parseFloat(left))
      },
      selectorTop () {
        let top = getComputedStyle(this.$refs.minimapSelector).top
        top = top.substr(0, top.length - 2)
        return Math.round(parseFloat(top))
      },
      selectorWidth () {
        let width = getComputedStyle(this.$refs.minimapSelector).width
        width = width.substr(0, width.length - 2)
        return Math.round(parseFloat(width))
      },
      selectorHeight () {
        let height = getComputedStyle(this.$refs.minimapSelector).height
        height = height.substr(0, height.length - 2)
        return Math.round(parseFloat(height))
      },
      selectorBorderWidth () {
        let border = getComputedStyle(this.$refs.minimapSelector).borderWidth
        border = border.substr(0, border.length - 2)
        return Math.round(parseFloat(border))
      },
      minimapBorderWidth () {
        let border = getComputedStyle(this.$el).borderWidth
        border = border.substr(0, border.length - 2)
        return Math.round(parseFloat(border))
      },
      willSelectorOverflowLeft (event) {
        return (event.offsetX - this.selectorWidth() / 2) <= 0
      },
      willSelectorOverflowRight (event) {
        return (event.offsetX + this.selectorWidth() / 2) >= MINIMAP_SIZE
      },
      willSelectorOverflowTop (event) {
        return (event.offsetY - this.selectorHeight() / 2) <= 0
      },
      willSelectorOverflowBottom (event) {
        return (event.offsetY + this.selectorHeight() / 2) > MINIMAP_SIZE
      },
      movedSelectorCenterX (event) {
        return (event.offsetX - this.selectorWidth() / 2) - this.selectorBorderWidth()
      },
      movedSelectorCenterY (event) {
        return (event.offsetY - this.selectorHeight() / 2) - this.selectorBorderWidth()
      }
    }
  }
</script>

<style lang="scss">
  .minimap {
    &__selector {
      position: absolute;
      border: 2px solid black;
      background: transparent;
      pointer-events: none;
      top: 0;
      left: 0;
    }
  }
</style>
