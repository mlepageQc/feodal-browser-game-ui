import { createApp, h } from 'vue'
import App from './App.vue'
import Router from './router'
import VueTippy, { TippyComponent } from 'vue-tippy'
import store from '@/store'

createApp({
	render: () => h(App) 
}).use(Router)
	.use(VueTippy)
	.use(store)
	.component('tippy', TippyComponent)
	.mount('#app')
