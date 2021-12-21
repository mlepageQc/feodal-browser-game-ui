<template>
  <div class="tile">
    <Spinner v-if="status === 'fetching'" />
    <div
      v-else 
      class="tile--nav">
      {{ x }}, {{ y }}
      <router-link :to="{ name: 'map' }">Close</router-link>
    </div>
    <ul class="tile--buildings-list">
      <li
        v-for="building in buildings"
        :key="building.id"
        class="tile--buildings-list-item">
        <img :src="building.url" />
        {{ building.name }}
        <div class="tile--buildings-list-item-actions">
          <button @click="build(building)">Build</button>
        </div>
      </li>  
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import { fetchBuildings, createUserBuilding } from '@/api/BuildingApi'
import Building from '@/types/Building'
import FetchingStatuses from '@/config/FetchingStatuses'
import { TILE_SIZE } from '@/lib/map/config'
import Spinner from '@/components/ui/Spinner.vue'

interface TileData {
  status: FetchingStatuses
  buildings: Building[]
}

export default defineComponent({
  components: {
    Spinner
  },
	props: {
		coordinates: {
      type: Object as () => { x: number; y: number },
      required: true
    }
	},
  data (): TileData {
    return {
      status: FetchingStatuses.Fetching,
      buildings: []
    }
  },
  computed: {
    ...mapState('map', [
      'map'
    ]),
    x (): number {
      return this.coordinates.x
    },
    y (): number {
      return this.coordinates.y
    }
  },
  created () {
    this.setup()
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
    async setup (): Promise<void> {
      try {
        this.buildings = (await fetchBuildings()).data
        this.status = FetchingStatuses.Idle
      } catch (e) {
        this.status = FetchingStatuses.Failed
        console.log(e)
      }
    },
    setMapSelectedTile () {
      this.map!.setSelectedTile(this.x * TILE_SIZE, this.y * TILE_SIZE)     
    },
    async build (building: Building): Promise<void> {
      const userBuilding = (
        await createUserBuilding(this.x, this.y, building.id)
      ).data

      this.map.drawImageFromUrl(
        this.x * TILE_SIZE, 
        this.y * TILE_SIZE, 
        userBuilding.buildingUrl
      )
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
    &--buildings-list {
      padding: 12px 0;
      &-item {
        padding: 8px 12px;
        display: flex;
        align-items: center;
        img {
          margin-right: 8px;
        }
        &:hover {
          background: lightgray;
        }
        &-actions {
          margin-left: auto;
        }
      }
    }
  }
</style>
