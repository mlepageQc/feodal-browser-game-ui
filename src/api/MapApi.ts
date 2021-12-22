import axios from '@/api/Axios'
import { ImageParams, ImageDataBase64String } from '@/lib/map/types'
import { AxiosResponse } from 'axios'

export function fetchMapImages (mapImages: ImageParams[]): Promise<AxiosResponse<ImageDataBase64String>> {
	return axios.get('/map_images', { params: { mapImages } })
}
