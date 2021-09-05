import { createRouter, createWebHashHistory } from 'vue-router'
import Login from '@/components/views/Login.vue'
import Signup from '@/components/views/Signup.vue'
import Map from '@/components/views/Map.vue'
import Tile from '@/components/views/Tile.vue'

export default createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: 'root',
			redirect: { name: 'login' }
		},
		{
			path: '/login',
			name: 'login',
			component: Login
		},
		{
			path: '/signup',
			name: 'signup',
			component: Signup
		},
		{ 
			path: '/map', 
			name: 'map',
			component: Map,
			children: [
				{
					path: '/tile', 
					name: 'tile',
					component: Tile,
					props: (to) => to.query
				}
			]
		}
	]
})
