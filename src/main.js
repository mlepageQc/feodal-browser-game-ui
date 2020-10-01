import Vue from 'vue'
import App from './App.vue'
import VueDragscroll from 'vue-dragscroll'
import VueKonva from 'vue-konva'

Vue.use(VueDragscroll)
Vue.use(VueKonva)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
