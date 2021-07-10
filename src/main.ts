import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import VueRouter from 'vue-router'
import VueTippy, { TippyComponent } from 'vue-tippy'
import VueI18n from 'vue-i18n'

createApp({
	$router: router,
	render: () => h(App) 
}).use(VueRouter)
	.use(VueTippy)
	.component('tippy', TippyComponent)
	.mount('#app')
