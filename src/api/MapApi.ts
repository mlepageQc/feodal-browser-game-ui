import axios from '@/api/Axios'
import { 
	CoordinatesSet, 
	ZoomLevel 
} from '@/lib/map/types'

export function fetchMapBase64Image (zoomLevel: ZoomLevel) {
	return axios('/map', { params: { zoomLevel } })
}

export function fetchBuildingsBase64Image () {
	return axios('/buildings')
}

export function fetchTileInformation (coordinates: CoordinatesSet) {
	return axios('/tiles', { params: { coordinates } })
}

export function fetchMinimapBase64Image () {
	return axios('/minimap')
}