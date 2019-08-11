<template lang="pug">
  div
    div.header(v-if="headerText") {{ headerText }}
    div.item-container
      item(
          v-for="item in items"
          :key="item.id"
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
    headerText: null,
    items: Array
  }
}
</script>

<style scoped>
.item-container {
  margin: 0.2rem;
}
.header {
  color: gray;
  background-color: rgba(0, 0, 0, 0.25);
  text-align: center;
  width: 100%;
  padding: 0.2rem 0.5rem;
}
</style>
