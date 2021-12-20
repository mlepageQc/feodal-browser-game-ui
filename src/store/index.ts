import { createStore } from 'vuex'
import { logout } from '@/api/SessionApi'
import map from '@/store/modules/map'
import session from '@/store/modules/session'

export interface State {
  initialized: boolean
}

const store = createStore<State>({
  state: {
    initialized: false
  },
  mutations: {
    setInitialized (state, value): void {
      state.initialized = value
    }
  },
  actions: {
    async initialize ({ commit, dispatch }): Promise<void> {
      await Promise.all<any>([
        dispatch('session/initialize')
      ])
      commit('setInitialized', true)
    },
    async logout ({ commit, dispatch }): Promise<void> {
			await logout()
			dispatch('session/destroy')
      dispatch('map/destroy')
      commit('setInitialized', false)
		}
  },
  modules: {
    session,
    map
  }
})

export default store
