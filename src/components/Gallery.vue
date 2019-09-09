<template lang="pug">
  div.gallery.has-dark-background
    div.media
    div.gallery-thumbnails
      div.gallery-thumb(
          v-for="thumb in thumbs"
          :key="item.key"
      )
</template>

<script>
export default {
  name: "Gallery",
  props: {
    items: {
      type: Array,
      default: () => []
    }
  }
  // data() {
  //   return {
  //     id: {
  //       type: String,
  //       default: null
  //     },
  //     lazyLoader: {
  //       type: LazyLoad,
  //       default: null
  //     }
  //   };
  // }
  // watch: {
  //   items: function (newVal, oldVal) {
  //     this.$nextTick(() => {
  //       this.lazyLoader.update()
  //     })
  //   }
  // },
  // beforeMount: function () {
  //   // Add unique id for lazyload to use
  //   // Set id before mount so that it's rendered
  //   this.id = 'item-container-' + this._uid
  // },
  // mounted: function () {
  //   this.lazyLoader = new LazyLoad({
  //     container: document.getElementById(this.id)
  //   })
  // }
};
</script>

<style scoped>
.gallery {
  height: 100%;
}
</style>
