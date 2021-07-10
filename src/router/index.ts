import VueRouter from 'vue-router'
import Map from '../components/views/Map.vue'
import Tile from '../components/views/Tile.vue'

const router = new VueRouter({
	routes: [
		{
			path: '/', 
			name: 'root',
			redirect: { name: 'map' }
		},
		{ 
			path: '/map', 
			name: 'map',
			component: Map,
			children: [
				{ 
					path: ':coordinates', 
					name: 'tile',
					component: Tile 
				}
			]
		}
	]
})

export default router