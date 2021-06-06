import axios from 'axios'

export function fetchMapBase64Image (params) {
	return axios({ url: 'http://localhost:3000/map', params })
}

export function fetchBuildingsBase64Image () {
	return axios({ url: 'http://localhost:3000/buildings' })
}

export function fetchTileInformation ({ x, y }) {
	return axios({ url: 'http://localhost:3000/tiles' }, { 
		params: { x, y } 
	})
}