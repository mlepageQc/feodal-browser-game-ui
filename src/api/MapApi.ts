import axios from '@/api/Axios'
import { 
	CoordinatesSet, 
	ZoomLevel 
} from '@/lib/map/types'
import { ImageParams } from '@/types/ImageParams'

export function fetchMapBase64Image (params: ImageParams) {
	return axios('/map', { params })
}

export function fetchBuildingsBase64Image () {
	return axios('/buildings')
}

export function fetchTileInformation (coordinates: CoordinatesSet) {
	return axios('/tiles', { params: { coordinates } })
}

export function fetchMinimapBase64Image (zoomLevel: ZoomLevel) {
	return axios('/minimap', { params: { zoomLevel } })
}