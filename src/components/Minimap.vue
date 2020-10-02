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
        // Set X
        let newX = 0
        if (this.willSelectorOverflowRight(event)) {
          newX = MINIMAP_SIZE - this.selectorAttribute('width') - this.selectorAttribute('borderWidth') * 2
        } else if (!this.willSelectorOverflowLeft(event)) {
          newX =  this.movedSelectorCenterX(event)
        }
        // Set Y
        let newY = 0
        if (this.willSelectorOverflowBottom(event)) {
          newY = MINIMAP_SIZE - this.selectorAttribute('height') - this.selectorAttribute('borderWidth') * 2
        } else if (!this.willSelectorOverflowTop(event)) {
          newY = this.movedSelectorCenterY(event)
        }

        this.translateMinimapSelector(newX, newY)

        this.$root.$emit('minimap:selection-change', {
          newSelectorX: newX,
          newSelectorY: newY
        })
      },
      translateMinimapSelector (newX, newY) {
        this.$refs.minimapSelector.style.left = `${newX}px`
        this.$refs.minimapSelector.style.top = `${newY}px`
      },
      selectorAttribute (attribute) {
        let styleAttribute = getComputedStyle(this.$refs.minimapSelector)[attribute]
        styleAttribute = styleAttribute.substr(0, styleAttribute.length - 2)
        return Math.round(parseFloat(styleAttribute))
      },
      minimapAttribute (attribute) {
        let border = getComputedStyle(this.$el).borderWidth
        border = border.substr(0, border.length - 2)
        return Math.round(parseFloat(border))
      },
      willSelectorOverflowLeft (event) {
        return (event.offsetX - this.selectorAttribute('width') / 2) <= 0
      },
      willSelectorOverflowRight (event) {
        return (event.offsetX + this.selectorAttribute('width') / 2) + this.selectorAttribute('borderWidth') >= MINIMAP_SIZE
      },
      willSelectorOverflowTop (event) {
        return (event.offsetY - this.selectorAttribute('height') / 2) <= 0
      },
      willSelectorOverflowBottom (event) {
        return (event.offsetY + this.selectorAttribute('height') / 2) + this.selectorAttribute('borderWidth') >= MINIMAP_SIZE
      },
      movedSelectorCenterX (event) {
        return (event.offsetX - this.selectorAttribute('width') / 2) - this.selectorAttribute('borderWidth')
      },
      movedSelectorCenterY (event) {
        return (event.offsetY - this.selectorAttribute('height') / 2) - this.selectorAttribute('borderWidth')
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
