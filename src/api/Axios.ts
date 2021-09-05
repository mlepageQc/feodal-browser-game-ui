import axios from 'axios'
import router from '@/router'

const instance = axios.create({
	baseURL: 'http://app.local:8000',
	withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) router.push({ name: 'login' })
    return Promise.reject(error)
  }
)

export default instance