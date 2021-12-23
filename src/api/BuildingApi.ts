import axios from '@/api/Axios'
import { ImageDataBase64String } from '@/lib/map/types'
import Building from '@/types/Building'
import UserBuilding from '@/types/UserBuilding'
import { AxiosResponse } from 'axios'

export function fetchBuildings (): Promise<AxiosResponse<Building[]>> {
	return axios.get('/buildings')
}

export function createUserBuilding (x: number, y: number, building_id: number): Promise<AxiosResponse<UserBuilding>> {
	return axios.post('/user_buildings', {
		user_building: { x, y, building_id }
	})
}

export function fetchUserBuilding (x: number, y: number): Promise<AxiosResponse<UserBuilding | null>> {
	return axios.get('/user_building', { params: { x, y } })
}

export function destroyUserBuilding (userBuildingId: number): Promise<AxiosResponse<ImageDataBase64String>> {
	return axios.delete(`/user_buildings/${userBuildingId}`)
}
