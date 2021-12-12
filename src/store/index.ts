import { createStore } from 'vuex'
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
    }
  },
  modules: {
    session,
    map
  }
})

export default store
