<template lang="pug">
  .browser.is-relative.has-text-light.has-background-dark
    .loading-overlay.is-overlay(:class="{'is-hidden': !loading}")
    Toolbar(ref="toolbar")
    //- Sidebar
    Gallery(
      v-if="appGalleryKey && !loading"
      :items="renderItems"
      :currentKey="appGalleryKey"
      @keyChange="appSetGalleryKey"
    )
    div.scroll-container.full-height
      ItemContainer(:items="renderItems" @open="openItem")
</template>

<script>
// @ is an alias to /src
import slug from 'slug'
import pathlib from 'path'
import { mapActions, mapGetters } from 'vuex'
import Toolbar from '@/components/Toolbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import Gallery from '@/components/Gallery.vue'
import ItemContainer from '@/components/ItemContainer.vue'

export default {
  name: 'Browser',
  components: {
    Toolbar,
    Sidebar,
    Gallery,
    ItemContainer
  },
  data () {
    return {
      path: '',
      searchSpec: '',
      items: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      appMode: 'app/getMode',
      appPath: 'app/getPath',
      appSearchSpec: 'app/getSearchSpec',
      appSortBy: 'app/getSortBy',
      appSortAsc: 'app/getSortAsc',
      appSegment: 'app/getSegment',
      appGalleryKey: 'app/getGalleryKey'
      // TODO: Implement segmenting (should this be here or server-side?)
      // TODO: Decide UI for database view
    }),
    renderItems () {
      const result = Array.from(this.items)
      result.forEach((item) => {
        item.key = slug(`${this.path}-${item.name}`)
      })

      if (this.appMode === 'search') {
        return result
      } else {
        let sortKey = 'name'
        if (this.appSortBy === 'mtime') sortKey = 'mtime'
        else if (this.appSortBy === 'type') sortKey = 'ext'
        else if (this.appSortBy === 'size') sortKey = 'size'
  
        const plusOne = this.appSortAsc ? 1 : -1
        const result = Array.from(this.items)

        return result.sort((a, b) => {
          if (a[sortKey] === b[sortKey]) {
            // Tie-break by name
            return (a.name === b.name) ? 0 : ((a.name < b.name) ? -1 : 1)
          } else {
            return (a[sortKey] < b[sortKey]) ? -plusOne : plusOne
          }
        })
      }
    }
  },
  watch: {
    'appMode' (newMode, oldMode) {
      this.loadDefaultItems()
    },
    'appPath' (newPath, oldPath) {
      this.getPathItems(newPath)
        .then(currentPath => {
          this.path = currentPath
        })
        .catch(err => {
          this.appSetPath(this.path)
          this.handleError(err)
        })
    },
    'appSearchSpec' (newSpec, oldSpec) {
      this.getSearchItems(newSpec)
        .then(currentSearchSpec => {
          this.searchSpec = currentSearchSpec
        })
        .catch(err => {
          this.appSetSearchSpec(this.searchSpec)
          this.handleError(err)
        })
    }
  },
  created () {
    window.addEventListener('keydown', this.onkey)
    this.loadDefaultItems()
  },
  beforeDestroy: function () {
    window.removeEventListener('keydown', this.onkey)
  },
  methods: {
    ...mapActions({
      appSetPath: 'app/setPath',
      appSetSearchSpec: 'app/setSearchSpec',
      appSetModeToPath: 'app/setModeToPath',
      appSetModeToSearch: 'app/setModeToSearch',
      appSetGalleryKey: 'app/setGalleryKey',
      apiGetPathItems: 'api/getPathItems',
      apiGetSearchItems: 'api/getSearchItems'
    }),
    getPathItems (path) {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.apiGetPathItems(path)
          .then(({ data }) => {
            resolve(path)
            this.items = data
          })
          .catch(err => {
            reject(err)
            this.handleError(err)
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    getSearchItems (searchSpec) {
      // TODO: Check if you need to keep track of pages/items, etc.
      this.loading = true
      return new Promise((resolve, reject) => {
        this.apiGetSearchItems(searchSpec)
          .then(({ data }) => {
            resolve(searchSpec)
            this.items = data
          })
          .catch(err => {
            reject(err)
            this.handleError(err)
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    loadDefaultItems () {
      if (this.appMode === 'path') {
        this.getPathItems(this.appPath)
          .then(currentPath => {
            this.path = currentPath
            this.appSetPath(this.path)
          })
          .catch(this.handleError)
      } else {
        this.getSearchItems(this.appSearchSpec)
          .then(currentSearchSpec => {
            this.searchSpec = currentSearchSpec
            this.appSetSearchSpec(this.searchSpec)
          })
          .catch(this.handleError)
      }
    },
    openItem (item) {
      if (this.loading) {
        return
      }
      if (this.appMode === 'path') {
        if (item.dir) {
          this.__openDir(item)
        } else {
          this.__openFile(item)
        }
      } else {
        this.__openFile(item)
      }
    },
    __openDir (item) {
      const newPath = pathlib.join(this.path, item.name)
      this.appSetPath(newPath)
    },
    __openFile (item) {
      this.appSetGalleryKey(item.key)
    },
    onkey (ev) {
      if (this.appMode === 'search' && ev.altKey && ev.code === 'KeyF') {
        this.$refs.toolbar.$refs.searchbar.focus()
        ev.preventDefault()
      }
    },
    handleError (err) {
      console.log(err)
      alert(err)
    }
  }
}
</script>

<style scoped>
.browser {
  height: 100%;
  padding-top: 3.25rem; /* For fixed top toolbar */
}
.loading-overlay {
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
}
</style>
