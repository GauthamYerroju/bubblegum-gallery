<template lang="pug">
  div.item.is-clipped(@click="$emit('open', item)")
    div.item-actions
    div.item-content
      img(v-if="renderItem.dir" src="/img/folder.svg")
      img.box.is-paddingless.item-media(v-if="!renderItem.dir && renderItem.src" :data-src="renderItem.src")
      span(v-if="!renderItem.dir && !renderItem.src") No Thumb
    div.item-name.has-text-centered
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
  width: 300px;
}
.item-action {
  width: 100%;
}
.item-name {
  white-space: nowrap;
}
.item-content {
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.item-content > .item-media {
  max-width: 100%;
  max-height: 100%;
}
</style>
