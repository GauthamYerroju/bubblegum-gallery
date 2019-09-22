<template lang="pug">
  div.gallery
    div
      img.gallery-media(:src="currentItem.src")
    //- div.gallery-thumbnails
      div.gallery-thumb(
          v-for="item in items"
          :key="item.key"
      )
        img(v-if="item.dir" src="/img/folder.svg")
        img.gallery-thumb-media.box.is-paddingless(v-if="!item.dir && item.src" :src="item.src")
        span(v-if="!item.dir && !item.src") No Thumb
</template>

<script>
export default {
  name: 'Gallery',
  props: {
    currentKey: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    currentIndex () {
      return this.items.findIndex((x) => x.key === this.currentKey)
    },
    currentItem () {
      return this.items[this.currentIndex]
    }
  },
  created () {
    window.addEventListener('keydown', this.onkey)
  },
  beforeDestroy () {
    window.removeEventListener('keydown', this.onkey)
  },
  methods: {
    changeToNextItem () {
      let index = this.currentIndex + 1
      if (index === this.items.length) {
        index = 0
      }
      this.$emit('keyChange', this.items[index].key)
    },
    changeToPrevItem () {
      let index = this.currentIndex - 1
      if (index < 0) {
        index = this.items.length - 1
      }
      this.$emit('keyChange', this.items[index].key)
    },
    onkey (ev) {
      if (ev.code === 'Escape') {
        this.$emit('keyChange', null)
      } else if (ev.code === 'ArrowLeft') {
        this.changeToPrevItem()
      } else if (ev.code === 'ArrowRight') {
        this.changeToNextItem()
      }
    }
  }
}
</script>

<style scoped>
.gallery {
  z-index: 100;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
}
.gallery-media {
  position: absolute;
  width: 100%;
  /* height: calc(100% - 20%); */
  height: 100%;
  object-fit: contain;
}
/* .gallery-thumbnails {
  z-index: 200;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 20%;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;
} */
</style>
