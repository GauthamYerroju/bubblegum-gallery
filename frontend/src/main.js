import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import sync from './sync'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faDatabase, faFolder, faHome, faFont, faClock, faShapes, faChartBar, faSortAmountDown, faSortAmountDownAlt, faListUl, faCog } from '@fortawesome/free-solid-svg-icons'

library.add(faDatabase, faFolder, faHome, faFont, faClock, faShapes, faChartBar, faSortAmountDown, faSortAmountDownAlt, faListUl, faCog)

const pinia = createPinia()
sync(pinia, router)

createApp(App)
  .use(pinia)
  .use(router)
  .component('fa-icon', FontAwesomeIcon)
  .mount('#app')
