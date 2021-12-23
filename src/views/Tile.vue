<template>
  <div class="tile">
    <Spinner v-if="status === 'fetching'" />
    <template v-else>
      <div
        class="tile--nav">
        {{ x }}, {{ y }}
        <div class="tile--nav-actions">
          <router-link :to="{ name: 'map' }">Close</router-link>
          <button @click="setMapSelectedTile">Center on</button>
        </div>    
      </div>
      <div
        v-if="userBuilding"
        class="tile--user-building">
        <img :src="userBuilding.buildingUrl" />
        {{ userBuilding.buildingName }}
        <div class="tile--user-building-actions">
          <button @click="destroy">Destroy</button>
        </div>
      </div>
      <ul class="tile--buildings-list">
        <li
          v-for="building in buildings"
          :key="building.id"
          class="tile--buildings-list-item">
          <img :src="building.url" />
          {{ building.name }}
          <div class="tile--buildings-list-item-actions">
            <button
              :disabled="userBuilding"
              @click="build(building)">
              Build
            </button>
          </div>
        </li>  
      </ul>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import { fetchBuildings, createUserBuilding, fetchUserBuilding, destroyUserBuilding } from '@/api/BuildingApi'
import Building from '@/types/Building'
import UserBuilding from '@/types/UserBuilding'
import FetchingStatuses from '@/config/FetchingStatuses'
import { TILE_SIZE } from '@/lib/map/config'
import Spinner from '@/components/ui/Spinner.vue'

interface TileData {
  status: FetchingStatuses
  userBuilding: UserBuilding | null,
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
      userBuilding: null,
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
  beforeRouteLeave (_to, _from, next) {
    this.map!.hideSelectedTile()
    next()
  },
  created () {
    this.setup()
  },
  mounted () {
    this.setMapSelectedTile()
  },
  watch: {
    'coordinates' () {
      this.setup()
      this.setMapSelectedTile()
    }
  },
  methods: {
    async setup (): Promise<void> {
      try {
        this.userBuilding = (
          await fetchUserBuilding(this.x, this.y)
        ).data
        this.buildings = (
          await fetchBuildings()
        ).data
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

      this.map.drawImageFromUrl({
        x: this.x * TILE_SIZE,
        y: this.y * TILE_SIZE,
        url: userBuilding.buildingUrl
      })

      this.userBuilding = userBuilding
    },
    async destroy (): Promise<void> {
      const restoredTileImaged = (await destroyUserBuilding(this.userBuilding!.id)).data
      this.userBuilding = null
      
      this.map.drawImageFromBase64String({
        x: restoredTileImaged.x * TILE_SIZE,
        y: restoredTileImaged.y * TILE_SIZE,
        data : restoredTileImaged.data
      })
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
      &-actions {
        display: flex;
        margin-left: auto;

        > :first-child {
          margin-right: 8px;
        }
      }
    }
    &--user-building {
      padding: 12px;
      border-bottom: 1px solid black;
      display: flex;
      align-items: center;
      img {
        margin-right: 8px;
      }
      &-actions {
        margin-left: auto;
      }
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
