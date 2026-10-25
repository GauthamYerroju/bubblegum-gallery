import { defineStore } from 'pinia'
import slugify from 'slugify'
import { useAppStore } from './app'

// Servers the gallery can read from, and the URLs for their endpoints
export const useSourcesStore = defineStore('sources', {
  state: () => ({
    currentSource: 'web-server-node',
    sources: {
      'web-server-node': {
        name: 'Web Server: Node',
        domain: 'localhost',
        port: 3000,
        url: {
          search: 'search?q=',
          listDir: 'listdir?path=',
          getFile: 'get-file?path=',
          getThumbnail: 'get-thumbnail?path=',
          doScan: 'scan'
        }
      }
    }
  }),
  getters: {
    source (state) {
      return state.sources[state.currentSource]
    },
    baseUrl () {
      let url = `//${this.source.domain}`
      if (this.source.port) {
        url += `:${this.source.port}`
      }
      return url
    },
    urlSearch () {
      return (searchSpec) => {
        const app = useAppStore()
        const offset = app.itemsPerPage * app.skipPages
        return `${this.baseUrl}/${this.source.url.search}${encodeURIComponent(searchSpec)}&sortBy=${app.sortBy}&sortAsc=${app.sortAsc}&offset=${offset}&limit=${app.itemsPerPage}`
      }
    },
    urlListDir () {
      return (path) => `${this.baseUrl}/${this.source.url.listDir}${encodeURIComponent(path)}`
    },
    urlGetFile () {
      return (path) => `${this.baseUrl}/${this.source.url.getFile}${encodeURIComponent(path)}`
    },
    urlGetThumbnail () {
      return (path) => `${this.baseUrl}/${this.source.url.getThumbnail}${encodeURIComponent(path)}`
    },
    urlDoScan () {
      return () => `${this.baseUrl}/${this.source.url.doScan}`
    }
  },
  actions: {
    set (newSource) {
      this.sources[slugify(newSource.name)] = newSource
    },
    add (newSource) {
      const name = slugify(newSource.name)
      if (name in this.sources) {
        throw Error(`Source names "${name}" already exists. Try set().`)
      }
      this.set(newSource)
    }
  }
})
