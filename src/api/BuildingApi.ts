import axios from '@/api/Axios'
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
