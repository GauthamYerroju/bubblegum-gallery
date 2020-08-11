import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import sync from './sync'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faDatabase, faFolder, faHome, faFont, faClock, faShapes, faChartBar, faSortAmountDown, faSortAmountDownAlt, faListUl, faCog } from '@fortawesome/free-solid-svg-icons'

library.add(faDatabase, faFolder, faHome, faFont, faClock, faShapes, faChartBar, faSortAmountDown, faSortAmountDownAlt, faListUl, faCog)
Vue.component('fa-icon', FontAwesomeIcon)

sync(store, router)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
