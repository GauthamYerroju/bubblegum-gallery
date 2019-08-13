import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import slugify from 'slugify'

Vue.use(Vuex)

const storeApp = {
  namespaced: true,
  state: {
    path: ''
  },
  getters: {
    getPath (state) {
      return state.path
    }
  },
  mutations: {
    SET_PATH (state, path) {
      state.path = path
    }
  },
  actions: {
    setPath ({ commit, state }, path) {
      if (path !== state.path) {
        commit('SET_PATH', path)
      }
    }
  }
}

const storeSources = {
  namespaced: true,
  state: {
    currentSource: 'web-server-node',
    sources: {
      'web-server-node': {
        name: 'Web Server: Node',
        domain: 'localhost',
        port: 3000,
        url: {
          listDir: 'listdir?path=',
          getFile: 'get-file?path=',
          getThumbnail: 'get-thumbnail?path='
        }
      }
    }
  },
  getters: {
    currentSource (state) {
      return state.sources[state.currentSource]
    },
    baseUrl (state, getters) {
      const src = getters.currentSource
      let url = `//${src.domain}`
      if (src.port) {
        url += `:${src.port}`
      }
      return url
    },
    urlListDir: (state, getters) => (path) => {
      return `${getters.baseUrl}/${getters.currentSource.url.listDir}${path}`
    },
    urlGetFile: (state, getters) => (path) => {
      return `${getters.baseUrl}/${getters.currentSource.url.getFile}${path}`
    },
    urlGetThumbnail: (state, getters) => (path) => {
      return `${getters.baseUrl}/${getters.currentSource.url.getThumbnail}${path}`
    }
  },
  mutations: {
    SET (state, newSource) {
      const name = slugify(newSource.name)
      state.sources[name] = newSource
    }
  },
  actions: {
    set ({ commit }, newSource) {
      commit('SET', newSource)
    },
    add ({ state, dispatch }, newSource) {
      const name = slugify(newSource.name)
      if (name in state.sources) {
        throw Error(`Source names "${name}" already exists. Try set().`)
      }
      dispatch('SET', newSource)
    }
  }
}

const storeApi = {
  namespaced: true,
  state: {
    // Throttle, debounce and queue logic will go here
  },
  actions: {
    getItems ({ rootGetters }, path) {
      return axios.get(rootGetters['sources/urlListDir'](path))
    },
    getFile ({ rootGetters }, path) {
      return axios.get(rootGetters['sources/urlListDir'](path))
    },
    getThumbnail ({ rootGetters }, path) {
      return axios.get(rootGetters['sources/urlListDir'](path))
    }
  }
}

export default new Vuex.Store({
  modules: {
    app: storeApp,
    api: storeApi,
    sources: storeSources
  }
})
