import { createApp } from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import { h } from '@vue/runtime-core'

const router = new VueRouter({
	routes: [
		{ path: '/', name: 'root', component: App }
	]
})

createApp({ 
	router,
	render: () => h(App) 
}).mount('#app')
