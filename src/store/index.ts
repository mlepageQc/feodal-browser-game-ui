import { createStore } from 'vuex'
import Map from '@/lib/map/Map'

export interface State {
	map: Map | null
}

const store = createStore<State>({
  state () {
    return {
			map: null
    }
  }
})

export default store