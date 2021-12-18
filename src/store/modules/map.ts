import { Module } from 'vuex'
import { State } from '@/store'
import Map from '@/lib/map/Map'
import { TILE_SIZE } from '@/lib/map/config'
import { CoordinatesSet, ZoomLevel } from '@/lib/map/types'
import { ImageParams } from '@/types/ImageParams'

interface MapState {
	map: Map | null
  mapMarginLeft: number
  mapMarginTop: number
	zoomLevel: ZoomLevel
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
		zoomLevel: 0
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
		}
	},
	getters: {
		// Fetching parameters for images
		imageParams (state): ImageParams {
			const imageParams: ImageParams = {
				zoomLevel: state.zoomLevel,
				coordinateSets: []
			}
			const imageX = state.mapMarginLeft * state.zoomLevel / TILE_SIZE
			const imageY = Math.abs(state.mapMarginTop * state.zoomLevel / TILE_SIZE)

			// Current tile according to top left coordinates
			imageParams.coordinateSets.push({
				x: imageX,
				y: imageY
			})
			
			// TODO code those conditions
			const fetchTopLeftImage = false

			const fetchTopImage = false

			const fetchTopRightImage = false

			const fetchLeftImage = false

			const fetchBottomLeftImage = false

			const fetchBottomImage = false

			const fetchBottomRightImage = false

			const fetchRightImage = false

			return imageParams
		}
	}
}

export default map
