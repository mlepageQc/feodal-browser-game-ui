import { createRouter, createWebHashHistory, START_LOCATION } from 'vue-router'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Map from '@/views/Map.vue'
import Tile from '@/views/Tile.vue'
import { getItem } from '@/lib/local-storage'
import store from '@/store'

const router = createRouter({
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
					path: 'tile', 
					name: 'tile',
					component: Tile,
					props: (to) => {
						return {
							coordinates: {
								x: parseInt(to.query.x as string),
								y: parseInt(to.query.y as string)
							}
						}
					}
				}
			]
		}
	]
})

router.beforeEach((to, from, next) => {
	if (from !== START_LOCATION && to.name !== 'login') return next()

	if (getItem('jwt')) {
		if (from === START_LOCATION) store.dispatch('initialize')
		if (to.name === 'login') return next({ name: 'map' })
	}
	next()
})

export default router
