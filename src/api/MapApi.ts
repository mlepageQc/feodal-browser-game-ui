import axios from '@/api/Axios'
import { ImageParams, ImageData } from '@/lib/map/types'
import { AxiosResponse } from 'axios'

export function fetchMapBase64Image (params: ImageParams): Promise<AxiosResponse<ImageData>> {
	return axios('/map', { params })
}
