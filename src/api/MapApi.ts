import axios from '@/api/Axios'
import { ImageParams } from '@/types/ImageParams'

export function fetchMapBase64Image (params: ImageParams) {
	return axios('/map', { params })
}
