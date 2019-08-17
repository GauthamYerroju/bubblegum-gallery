<template lang="pug">
  .browser.is-relative
    .loading-overlay.is-overlay(:class="{'is-hidden': !loading}") // TODO: Might need to move this to ItemContainer
    Toolbar
    //- Sidebar
    div {{ path }}
    ItemContainer(:items="items" @open="openItem")
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
      items: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      appPath: 'app/getPath'
    }),
    queryPath () {
      return this.$route.query.path
    }
  },
  watch: {
    '$route' (to, from) {
      if (this.path === this.queryPath) {
        return
      }
      this.getItems(this.queryPath)
        .then(currentPath => {
          this.path = currentPath
          this.appSetPath(this.path)
        })
        .catch(this.handleError)
    },
    'appPath' (newPath, oldPath) {
      if (newPath === this.path) {
        return
      }
      this.getItems(newPath)
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
    }
  },
  created () {
    this.getItems(this.appPath || this.queryPath)
      .then(currentPath => {
        this.path = currentPath
        this.appSetPath(this.path)
      })
      .catch(this.handleError)
  },
  methods: {
    ...mapActions({
      appSetPath: 'app/setPath',
      apiGetItems: 'api/getItems'
    }),
    getItems (path) {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.apiGetItems(path)
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
}
.loading-overlay {
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
}
</style>
