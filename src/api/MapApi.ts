import axios from 'axios'
import { 
	CoordinatesSet, 
	ZoomLevel 
} from '@/lib/map/types'

export function fetchMapBase64Image (zoomLevel: ZoomLevel) {
	return axios({ url: 'http://localhost:3000/map', params: { zoomLevel } })
}

export function fetchBuildingsBase64Image () {
	return axios({ url: 'http://localhost:3000/buildings' })
}

export function fetchTileInformation (coordinates: CoordinatesSet) {
	return axios({ url: 'http://localhost:3000/tiles', params: { coordinates } })
}

export function fetchMinimapBase64Image () {
	return axios({ url: 'http://localhost:3000/minimap' })
}