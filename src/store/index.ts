import { createStore } from 'vuex'
import Map from '@/lib/map/Map'
import session from '@/store/modules/session'

export interface State {
	map: Map | null
  mapMarginLeft: number
  mapMarginTop: number
  initialized: boolean
}

interface MapMargins {
  marginLeft: number | string
  marginTop: number | string
}

const store = createStore<State>({
  state: {
		map: null,
    mapMarginLeft: 0,
    mapMarginTop: 0,
    initialized: false
  },
  mutations: {
    setInitialized (state, value): void {
      state.initialized = value
    },
    setMapMargins (state, { marginLeft, marginTop }: MapMargins): void {
      state.mapMarginLeft = parseInt(marginLeft.toString())
      state.mapMarginTop = parseInt(marginTop.toString())
    },
    setMap (state, map): void {
      state.map = map
    }
  },
  actions: {
    async initialize ({ commit, dispatch }): Promise<void> {
      await Promise.all<any>([
        dispatch('session/initialize')
      ])
      commit('setInitialized', true)
    }
  },
  modules: {
    session
  }
})

export default store
