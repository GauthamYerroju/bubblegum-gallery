import Vue from 'vue'
import Router from 'vue-router'
import App from './App.vue'
import Browser from './views/Browser.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: App,
      children: [
        {
          path: '/',
          name: 'browser',
          component: Browser
        },
        {
          path: '/about',
          name: 'about',
          // route level code-splitting
          // this generates a separate chunk (about.[hash].js) for this route
          // which is lazy-loaded when the route is visited.
          component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
        },
        {
          path: '/settings',
          name: 'settings',
          component: () => import(/* webpackChunkName: "settings" */ './views/Settings.vue')
        }
      ]
    }
  ]
})
