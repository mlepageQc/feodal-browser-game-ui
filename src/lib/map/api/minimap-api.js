import axios from 'axios'

export function fetchMinimapBase64Image () {
	return axios({ url: 'http://localhost:3000/minimap' })
}