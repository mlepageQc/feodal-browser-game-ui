import { createApp, h } from 'vue'
import App from './App.vue'
import router from './router'
import VueTippy, { TippyComponent } from 'vue-tippy'
import VueI18n from 'vue-i18n'

createApp({
	render: () => h(App) 
}).use(router)
	.use(VueTippy)
	.component('tippy', TippyComponent)
	.mount('#app')
