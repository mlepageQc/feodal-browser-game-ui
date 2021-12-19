import { Module } from 'vuex'
import { State } from '@/store'
import Map from '@/lib/map/Map'
import { MAP_SIZE } from '@/config/Map'
import { ZoomLevel } from '@/lib/map/types'
import { ImageParams } from '@/types/ImageParams'

interface MapState {
	map: Map | null
  mapMarginLeft: number
  mapMarginTop: number
	zoomLevel: ZoomLevel
	fetchedImagesData: ImageParams[]
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
		mapMarginTop: 0,
		zoomLevel: 0,
		fetchedImagesData: [] // Caching fetched images, mechanism to clear cache will come eventually
	},
	mutations: {
		setMapMargins (state, { marginLeft, marginTop }: MapMargins): void {
      state.mapMarginLeft = parseInt(marginLeft.toString())
      state.mapMarginTop = parseInt(marginTop.toString())
    },
    setMap (state, map): void {
      state.map = map
    },
		setMapZoomLevel (state, zoomLevel: MapState['zoomLevel']): void {
			state.zoomLevel = zoomLevel
		},
		addFetchedImagesData (state, imagesParams: ImageParams) {
			state.fetchedImagesData = state.fetchedImagesData.concat(imagesParams)
		}
	},
	getters: {
		mapSize (state): number {
			return (state.zoomLevel + 1) * MAP_SIZE
		}
	}
}

export default map
