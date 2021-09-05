import { createApp, h } from 'vue'
import App from './App.vue'
import Router from './router'
import VueTippy, { TippyComponent } from 'vue-tippy'
import VueI18n from 'vue-i18n'
import Store from '@/store'

createApp({
	render: () => h(App) 
}).use(Router)
	.use(VueTippy)
	.use(Store)
	.component('tippy', TippyComponent)
	.mount('#app')
