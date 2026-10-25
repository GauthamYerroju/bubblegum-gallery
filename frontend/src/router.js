import Vue from 'vue'
import Router from 'vue-router'
import Browser from './views/Browser.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'browser',
      component: Browser
    },
    {
      path: '/settings',
      name: 'settings',
      // route level code-splitting
      // this generates a separate chunk (settings.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import('./views/Settings.vue')
    }
  ]
})
