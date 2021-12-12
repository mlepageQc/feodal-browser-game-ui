import { createStore } from 'vuex'
import Map from '@/lib/map/Map'
import session from '@/store/modules/session'

export interface State {
	map: Map | null
  initialized: boolean
}

const store = createStore<State>({
  state: {
		map: null,
    initialized: false,
  },
  mutations: {
    setInitialized (state, value) {
      state.initialized = value
    },
    setMap (state, map) {
      state.map = map
    }
  },
  actions: {
    async initialize ({ commit, dispatch }) {
      await Promise.all<any>([
        dispatch('session/initialize')
      ])
      commit('setInitialized', true)
    },
    async initializeMap ({ commit }, mapContainer) {

    }
  },
  modules: {
    session
  }
})

export default store
