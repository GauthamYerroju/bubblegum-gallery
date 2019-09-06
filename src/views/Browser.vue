<template lang="pug">
  .browser.is-relative.has-text-light.has-background-dark
    .loading-overlay.is-overlay(:class="{'is-hidden': !loading}")
    Toolbar
    //- Sidebar
    ItemContainer(:items="renderItems" @open="openItem")
</template>

<script>
// @ is an alias to /src
import pathlib from 'path'
import { mapActions, mapGetters } from 'vuex'
import Toolbar from '@/components/Toolbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import ItemContainer from '@/components/ItemContainer.vue'

export default {
  name: 'Browser',
  components: {
    Toolbar,
    Sidebar,
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
      appSegment: 'app/getSegment'
      // TODO: Implement segmenting (should this be here or server-side?)
      // TODO: Decide UI for database view
    }),
    queryPath () {
      return this.$route.query.path
    },
    querySearch () {
      return this.$route.query.search
    },
    renderItems () {
      let sortKey = 'name'
      if (this.appSortBy === 'mtime') sortKey = 'mtime'
      else if (this.appSortBy === 'type') sortKey = 'ext'
      else if (this.appSortBy === 'size') sortKey = 'size'

      const plusOne = this.appSortAsc ? 1 : -1
      const result = Array.from(this.items)
      result.forEach((item, i) => {
        item.key = this.path + i
      })
      return result.sort((a, b) => {
        if (a[sortKey] === b[sortKey]) {
          // Tie-break by name
          return (a.name === b.name) ? 0 : ((a.name < b.name) ? -1 : 1)
        } else {
          return (a[sortKey] < b[sortKey]) ? -plusOne : plusOne
        }
      })
    }
  },
  watch: {
    // Changing path will update route
    // Changing route will update path
    // Avoid recursion by checking for same path
    // (and only do it here, keep everywhere else clean)
    '$route' (to, from) {
      if (this.appMode === 'path') {
        if (this.path === this.queryPath) {
          return
        }
        this.getPathItems(this.queryPath)
          .then(currentPath => {
            this.path = currentPath
            this.appSetPath(this.path)
          })
          .catch(this.handleError)
      } else {
        if (this.searchSpec === this.querySearch) {
          return
        }
        this.getSearchItems(this.querySearch)
          .then(currentSearchSpec => {
            this.searchSpec = currentSearchSpec
            this.appSetSearchSpec(this.searchSpec)
          })
          .catch(this.handleError)
      }
    },
    'appPath' (newPath, oldPath) {
      if (newPath === this.path) {
        return
      }
      this.getPathItems(newPath)
        .then(currentPath => {
          this.path = currentPath
          if (this.path !== this.queryPath) {
            this.$router.push(`${this.$route.path}?path=${this.path}`)
          }
        })
        .catch(err => {
          this.appSetPath(this.path)
          this.handleError(err)
        })
    },
    'appSearchSpec' (newSpec, oldSpec) {
      // TODO: test this
      if (newSpec === this.searchSpec) {
        return
      }
      this.getSearchItems(newSpec)
        .then(currentSearchSpec => {
          this.searchSpec = currentSearchSpec
          if (this.searchSpec !== this.querySearch) {
            this.$router.push(`${this.$route.path}?search=${this.querySearch}`)
          }
        })
        .catch(err => {
          this.appSetSearchSpec(this.searchSpec)
          this.handleError(err)
        })
    }
  },
  created () {
    if (this.appMode === 'path') {
      this.getPathItems(this.appPath || this.queryPath || '')
        .then(currentPath => {
          this.path = currentPath
          this.appSetPath(this.path)
        })
        .catch(this.handleError)
    } else {
      this.getSearchItems(this.appSearchSpec || this.querySearch || '')
        .then(currentSearchSpec => {
          this.searchSpec = currentSearchSpec
          this.appSetSearchSpec(this.searchSpec)
        })
        .catch(this.handleError)
    }
  },
  methods: {
    ...mapActions({
      appSetPath: 'app/setPath',
      appSetSearchSpec: 'app/setSearchSpec',
      appSetModeToPath: 'app/setModeToPath',
      appSetModeToSearch: 'app/setModeToSearch',
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
    openItem (item) {
      if (this.loading) {
        return
      }
      if (item.dir) {
        const newPath = pathlib.join(this.path, item.name)
        this.appSetPath(newPath)
      } else {
        alert(item.name)
      }
    },
    handleError (err) {
      console.log(err)
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
