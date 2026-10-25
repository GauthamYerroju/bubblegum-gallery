import { defineStore } from 'pinia'

// View state. Most of it is mirrored in the URL by sync.js.
export const useAppStore = defineStore('app', {
  state: () => ({
    mode: 'path', // 'path' (folder view) or 'search' (database view)
    path: '',
    searchSpec: '',
    sortBy: 'name',
    sortAsc: true,
    page: 0,
    skipPages: 0,
    itemsPerPage: 40,
    segment: false,
    galleryKey: null
  })
})
