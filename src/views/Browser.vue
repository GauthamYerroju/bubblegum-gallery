<template lang="pug">
  div.browser
    Toolbar
    //- Sidebar
    ItemContainer(:items="items" @open="openItem")
</template>

<script>
// @ is an alias to /src
import axios from 'axios'
import Toolbar from '@/components/Toolbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import ItemContainer from '@/components/ItemContainer.vue'

export default {
  name: 'browser',
  data () {
    return {
      path: null,
      items: [],
      loading: false
    }
  },
  components: {
    Toolbar,
    Sidebar,
    ItemContainer
  },
  methods: {
    getItems (path) {
      this.loading = true
      return new Promise((resolve, reject) => {
        axios.get(`//localhost:3000/listdir?path=${path || ''}`)
          .catch(reject)
          .then(items => {
            this.items = items.data
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
        this.setPath(item.path)
      } else {
        alert(item.path)
      }
    },
    setPath (path) {
      path = path || ''
      if (path !== this.path) {
        const that = this
        this.getItems(path)
          .catch(err => {
            console.error(err)
            alert(err)
          })
          .then(() => {
            that.path = path
          })
      }
    }
  },
  created () {
    this.setPath()
  }
}
</script>
