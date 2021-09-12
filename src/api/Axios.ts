import axios from 'axios'
import router from '@/router'

const baseURL = process.env === 'development' ? 'http://app.local:8000' : 'https://obscure-plateau-79291.herokuapp.com'

const instance = axios.create({
	baseURL,
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