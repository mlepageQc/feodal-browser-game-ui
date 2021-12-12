import { Module } from 'vuex'
import { State } from '@/store'
import Map from '@/lib/map/Map'

interface MapState {
	map: Map | null
  mapMarginLeft: number
  mapMarginTop: number
}

interface MapMargins {
  marginLeft: number | string
  marginTop: number | string
}

const map: Module<MapState, State> = {
	namespaced: true, 
	state: {
		map: null,
		mapMarginLeft: 0,
		mapMarginTop: 0
	},
	mutations: {
		setMapMargins (state, { marginLeft, marginTop }: MapMargins): void {
      state.mapMarginLeft = parseInt(marginLeft.toString())
      state.mapMarginTop = parseInt(marginTop.toString())
    },
    setMap (state, map): void {
      state.map = map
    }
	}
}

export default map
