import axios from '@/api/Axios'

export function login (name: string, password: string) {
	return axios.post('/login', { auth: { name, password } })
}
