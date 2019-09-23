import { stringify } from 'querystring'
import extend from 'lodash/extend'
import pickBy from 'lodash/pickBy'
import snakeCase from 'lodash/snakeCase'

// Thanks for this: https://stackoverflow.com/questions/44171210/what-is-vuex-router-sync-for

export default (store, router) => {
  // react to store and update route
  store.watch(
    state => {
      const { mode, path, searchSpec, galleryKey } = state.app
      return { mode, path, searchSpec, galleryKey }
    },
    watched => {
      const q = stringify(pickBy(watched, x => x))
      if (stringify(watched) !== stringify(router.history.current.query)) {
        // TODO: If only difference is galleryOpen, do replace instead of push.
        router.push( {query: watched} )
      }
    }
  )
  // react to route and update store
  router.afterEach((to, from) => {
    const qTo = to.query
    const qFrom = from.query
    if (stringify(qTo) !== stringify(qFrom)) {
      // TODO: This is hacky and relies on naming conventions. I can do better.
      const diff = extend(qFrom, qTo)
      for(const key in diff) {
        const mutation = `app/SET_${snakeCase(key).toUpperCase()}`
        store.commit(mutation, diff[key])
      }
    }
  })
}
