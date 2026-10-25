import { watch } from 'vue'
import { useAppStore } from './stores/app'

// Two-way sync between the app store and the URL query.
// Thanks for the idea: https://stackoverflow.com/questions/44171210/what-is-vuex-router-sync-for

// Keys mirrored in the URL, with how to read them back from a query string value
const urlKeys = {
  mode: v => v,
  path: v => v,
  searchSpec: v => v,
  page: v => Number(v),
  sortBy: v => v,
  sortAsc: v => v !== 'false',
  segment: v => v === 'true',
  galleryKey: v => v || null
}
// Changing these adds a history entry; other changes replace the current one
const pushTriggers = ['mode', 'path', 'searchSpec']

// Same output as Node's querystring.stringify for flat objects (null/undefined become empty)
const stringify = query => new URLSearchParams(
  Object.entries(query).map(([k, v]) => [k, v === null || v === undefined ? '' : String(v)])
).toString()

export default (pinia, router) => {
  const app = useAppStore(pinia)
  const defaults = { ...app.$state } // state before the URL is applied

  // react to store and update route
  watch(
    () => Object.fromEntries(Object.keys(urlKeys).map(key => [key, app[key]])),
    watched => {
      const oldQuery = router.currentRoute.value.query
      if (stringify(oldQuery) !== stringify(watched)) {
        let push = pushTriggers.some(key => oldQuery[key] !== watched[key])
        if (!push) {
          // Opening the viewer is a history entry too, so Back closes it
          push = oldQuery.galleryKey === null && watched.galleryKey !== null
        }
        const query = Object.fromEntries(
          Object.entries(watched).map(([k, v]) => [k, v === null ? null : String(v)])
        )
        router[push ? 'push' : 'replace']({ query })
      }
    }
  )

  // react to route and update store
  router.afterEach((to, from, failure) => {
    // afterEach also runs for navigations that were cancelled by a newer one; applying those
    // would write stale values back to the store and start a store <-> URL ping-pong
    if (failure) return
    if (stringify(to.query) !== stringify(from.query)) {
      // Only keys the URL has, or just lost; a key that was never in the URL keeps its store value
      const values = {}
      for (const [key, parse] of Object.entries(urlKeys)) {
        if (!(key in to.query) && !(key in from.query)) continue
        const v = to.query[key]
        values[key] = (v === undefined || v === null) ? defaults[key] : parse(v)
      }
      app.$patch(values)
    }
  })
}

// TODO: handle modes: hide keys in url based on mode
