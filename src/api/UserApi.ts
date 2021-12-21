import axios from '@/api/Axios'
import User from '@/types/User'
import { AxiosResponse } from 'axios'

export function createUser (name: string, email: string, password: string, passwordConfirmation: string): Promise<AxiosResponse<User>> {
	return axios.post('/users', {
		user: { name, email, password, password_confirmation: passwordConfirmation }
	})
}

export function fetchCurrentUser (): Promise<AxiosResponse<User>> {
	return axios.get('/me')
}
