<template lang="pug">
  div.item(@click="$emit('open', item)")
    div.item-actions
    div.item-content
      span(v-if="renderItem.dir") ???
      div(v-if="!renderItem.dir")
        img(v-if="renderItem.src" :src="renderItem.src")
        span(v-if="!renderItem.src") No Thumb
    div.item-name
      | {{ item.name }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Item',
  props: {
    item: {
      type: Object,
      default: () => ({
        dir: true,
        thumb: null
      })
    }
  },
  computed: {
    ...mapGetters('sources', ['urlGetFile', 'urlGetThumbnail']),
    renderItem () {
      const item = this.item
      if (item.thumb) {
        item.src = this.urlGetThumbnail(item.thumb)
      } else if (item.useSrc) {
        item.src = this.urlGetFile(item.path)
      }
      return item
    }
  }
}
</script>

<style scoped>
.item {
  display: inline-block;
  width: 300px;
  height: 200px;
}
</style>
