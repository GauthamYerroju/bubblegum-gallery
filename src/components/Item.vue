<template lang="pug">
  div.item.card(@click="$emit('open', item)")
    div.item-actions
    div.item-content
      span(v-if="item.dir") ???
      div(v-if="!item.dir")
        img(v-if="item.src" :src="item.src")
        span(v-if="!item.src") No Thumb
    div.item-name
      | {{ item.name }}
</template>

<script>

export default {
  name: 'Item',
  props: {
    item: Object
  },
  methods: {
    renderItem () {
      const item = this.item
      if (item.thumb) {
        item.src = `//localhost://3000/get-thumbnail?path=${item.thumb}`
      } else if (item.useSrc) {
        item.src = `//localhost:3000/get-file?path=${item.path}`
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
