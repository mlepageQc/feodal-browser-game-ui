<template>
  <div class="tile">
    <div class="tile--nav">
      {{ x }}, {{ y }}
      <router-link :to="{ name: 'map' }">Quit</router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState, mapMutations } from 'vuex'

import { TILE_SIZE } from '@/lib/map/config'

export default defineComponent({
	props: {
		coordinates: {
      type: Object as () => { x: number; y: number },
      required: true
    }
	},
  computed: {
    ...mapState([
      'map'
    ]),
    x (): number {
      return this.coordinates.x
    },
    y (): number {
      return this.coordinates.y
    }
  },
  mounted () {
    this.setMapSelectedTile()
  },
  watch: {
    'coordinates' () {
      this.setMapSelectedTile()
    }
  },
  methods: {
    ...mapMutations([
      'setMapMargins'
    ]),
    setMapSelectedTile () {
      this.map!.setSelectedTile(this.x * TILE_SIZE, this.y * TILE_SIZE)     
    }
  }
})
</script>

<style lang="scss">
  .tile {
    border-left: 1px solid black;
    background: #EBEBEB;
    min-width: 336px;
    flex: 1;
    &--nav {
      display: flex;
      align-items: center;
      padding: 0 16px;
      height: 56px;
      border-bottom: 1px solid black;
    }
  }
</style>