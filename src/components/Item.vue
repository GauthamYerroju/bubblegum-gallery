<template lang="pug">
  div.item.is-clipped(@click="$emit('open', item)")
    div.item-actions
    div.item-content
      span(v-if="renderItem.dir") ???
      img.box.is-paddingless(v-if="!renderItem.dir && renderItem.src" :src="renderItem.src")
      span(v-if="!renderItem.dir && !renderItem.src") No Thumb
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
  margin: 1rem;
}
.item-action {
  max-width: 300px;
}
.item-name {
  max-width: 300px;
  padding: 1rem;
}
.item-content {
  width: 300px;
  height: 300px;
}
.item-content > img {
  max-width: 100%;
  max-height: 100%;
  margin-left: auto;
  margin-right: auto;
}
</style>
