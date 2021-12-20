import { createRouter, createWebHashHistory } from 'vue-router'
import Characters from '@/views/Characters.vue'
import Login from '@/views/Login.vue'
import Signup from '@/views/Signup.vue'
import Header from '@/components/layout/Header.vue'
import MainNav from '@/components/layout/nav/MainNav.vue'
import Map from '@/views/Map.vue'
import Tile from '@/views/Tile.vue'
import Spinner from '@/components/ui/Spinner.vue'
import { getItem } from '@/lib/local-storage'
import RouteNames from '@/config/RouteNames'
import store from '@/store'

const BASE_LAYOUT = {
	spinner: Spinner,
	header: Header,
	nav: MainNav
}

const router = createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: '/',
			name: RouteNames.Root,
			redirect: { name: RouteNames.Login }
		},
		{
			path: '/login',
			name: RouteNames.Login,
			component: Login
		},
		{
			path: '/signup',
			name: RouteNames.Signup,
			component: Signup
		},
		{ 
			path: '/map', 
			name: RouteNames.Map,
			components: { default: Map, ...BASE_LAYOUT },
			children: [
				{
					path: 'tile', 
					name: RouteNames.Tile,
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
		},
		{
			path: '/characters',
			name: RouteNames.Characters,
			components: { default: Characters, ...BASE_LAYOUT },
		}
	]
})

router.beforeEach(async (to, _from, next) => {
	if (getItem('jwt')) {
		if (!store.state.initialized) {
			await store.dispatch('initialize')
		}
		if (to.name === RouteNames.Login) {
			next({ name: RouteNames.Map })
		} else {
			next()
		}
	} else if (to.name !== RouteNames.Login && to.name !== RouteNames.Signup) {
		next({ name: RouteNames.Login })
	} else {
		next()
	}
})

export default router
