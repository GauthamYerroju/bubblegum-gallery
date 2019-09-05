<template lang="pug">
  div.item-container(:id="id")
    div.header(v-if="headerText") {{ headerText }}
    div.items
      item(
          v-for="item in items"
          :key="item.key"
          :item="item"
          @open="$emit('open', item)"
      )
</template>

<script>
import Item from '@/components/Item'
import LazyLoad from 'vanilla-lazyload'

export default {
  name: 'ItemContainer',
  components: {
    Item
  },
  props: {
    headerText: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      id: {
        type: String,
        default: null
      },
      lazyLoader: {
        type: LazyLoad,
        default: null
      }
    }
  },
  watch: {
    items: function (newVal, oldVal) {
      this.$nextTick(() => {
        this.lazyLoader.update()
      })
    }
  },
  beforeMount: function () {
    // Add unique id for lazyload to use
    // Set id before mount so that it's rendered
    this.id = 'item-container-' + this._uid
  },
  mounted: function () {
    this.lazyLoader = new LazyLoad({
      container: document.getElementById(this.id)
    })
  }
}
</script>

<style scoped>
.item-container {
  height: 100%;
  overflow: auto;
}
.header {
  color: gray;
  background-color: rgba(0, 0, 0, 0.25);
  text-align: center;
  width: 100%;
  padding: 0.2rem 0.5rem;
}
.items {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
