<template lang="pug">
  div.item-container
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
  }
}
</script>

<style scoped>
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
