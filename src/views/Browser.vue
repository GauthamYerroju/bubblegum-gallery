<template lang="pug">
  div.browser
    Toolbar
    //- Sidebar
    div {{ appPath }}
    ItemContainer(:items="items" @open="openItem")
</template>

<script>
// @ is an alias to /src
import path from 'path'
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
      items: [],
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      appPath: 'app/getPath'
    })
  },
  created () {
    this.getItems(this.appPath)
  },
  methods: {
    ...mapActions({
      appSetPath: 'app/setPath',
      apiGetItems: 'api/getItems'
    }),
    getItems (path) {
      this.loading = true
      if (path === this.path) {
        return
      }
      this.apiGetItems(path)
        .catch(console.error)
        .then(({ data }) => {
          this.items = data
          this.appSetPath(path)
        })
        .finally(() => {
          this.loading = false
        })
    },
    openItem (item) {
      if (this.loading) {
        return
      }
      const newPath = path.join(this.appPath, item.name)
      if (item.dir) {
        this.getItems(newPath)
      } else {
        alert(item.name)
      }
    }
  }
}
</script>
