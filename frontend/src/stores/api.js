import { defineStore } from 'pinia'
import axios from 'axios'
import { useSourcesStore } from './sources'

export const useApiStore = defineStore('api', {
  state: () => ({
    // Throttle, debounce and queue logic will go here
  }),
  actions: {
    getSearchItems (searchSpec) {
      return axios.get(useSourcesStore().urlSearch(searchSpec))
    },
    getPathItems (path) {
      return axios.get(useSourcesStore().urlListDir(path))
    },
    getFile (path) {
      return axios.get(useSourcesStore().urlListDir(path))
    },
    getThumbnail (path) {
      return axios.get(useSourcesStore().urlListDir(path))
    },
    doScan () {
      return axios.get(useSourcesStore().urlDoScan())
    }
  }
})
