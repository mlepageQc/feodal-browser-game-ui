import axios from '@/api/Axios'

export function login (username: string, password: string) {
	return axios.post('/login', {}, { auth: { username, password } })
}

export function logout () {
	return axios.get('/logout')
}
