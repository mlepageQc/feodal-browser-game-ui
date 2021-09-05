import axios from '@/api/Axios'

export function createUser (name: string, email: string, password: string, passwordConfirmation: string) {
	return axios.post('/users', {
		user: {
			name, email, password, password_confirmation: passwordConfirmation
		}
	})
}