import { stringify } from 'querystring'
import keys from 'lodash/keys'
import union from 'lodash/union'
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
      if (stringify(watched) !== stringify(router.history.current.query)) {
        // TODO: If only difference is galleryOpen, do replace instead of push.
        router.push({ query: watched })
      }
    }
  )
  // react to route and update store
  router.afterEach((to, from) => {
    const qTo = to.query
    const qFrom = from.query
    if (stringify(qTo) !== stringify(qFrom)) {
      const diff = {}
      const kAll = union(keys(qTo), keys(qFrom))
      for (const key of kAll) {
        diff[key] = qTo[key]
      }
      for (const key in diff) {
        // TODO: This is hacky and relies on naming conventions. I can do better.
        const mutation = `app/SET_${snakeCase(key).toUpperCase()}`
        store.commit(mutation, diff[key])
      }
    }
  })
}

// TODO: handle modes: hide keys in url based on mode