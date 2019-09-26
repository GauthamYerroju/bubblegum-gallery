<template lang="pug">
  div.gallery(@click="close" @contextmenu="oncontextmenu" @wheel="onwheel")
    div
      img.gallery-media(:src="currentItem.src" :style="zoomCss")
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
  data () {
    return {
      mouseNavigating: false,
      zoomScale: 1
    }
  },
  computed: {
    currentIndex () {
      return this.items.findIndex((x) => x.key === this.currentKey)
    },
    currentItem () {
      return this.items[this.currentIndex]
    },
    zoomCss () {
      return `transform: scale3d(${this.zoomScale}, ${this.zoomScale}, 1);`
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
    close () {
      this.$emit('keyChange', null)
    },
    zoomIn () {
      const newScale = this.zoomScale + 0.2
      this.zoomScale = (newScale) >= 10 ? 10 : newScale
    },
    zoomOut () {
      const newScale = this.zoomScale - 0.2
      this.zoomScale = (newScale) <= 0.2 ? 0.2 : newScale
    },
    onkey (ev) {
      if (ev.code === 'Escape') {
        this.close()
      } else if (ev.code === 'ArrowLeft') {
        this.changeToPrevItem()
      } else if (ev.code === 'ArrowRight') {
        this.changeToNextItem()
      }
    },
    onwheel (ev) {
      const scrollUp = ev.deltaY < 0
      const rightBtnDown = ev.buttons === 2
      if (scrollUp) {
        if (rightBtnDown) {
          this.mouseNavigating = true
          this.zoomScale = 1
          this.changeToPrevItem()
        } else {
          this.zoomIn()
        }
      } else {
        if (rightBtnDown) {
          this.mouseNavigating = true
          this.zoomScale = 1
          this.changeToNextItem()
        } else {
          this.zoomOut()
        }
      }
    },
    oncontextmenu (ev) {
      if (this.mouseNavigating) {
        ev.preventDefault()
        this.mouseNavigating = false
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
  transition: transform 100ms;
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
