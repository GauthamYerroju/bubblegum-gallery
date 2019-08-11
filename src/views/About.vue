<template lang="pug">
  div.about
    HeaderBar(name="About")
    h1 Bubblegum Gallery
    p Version information, current status, license, and information from server through props goes here.
</template>

<script>
// @ is an alias to /src
import HeaderBar from '@/components/HeaderBar.vue'

export default {
  name: 'about',
  components: {
    HeaderBar
  }
}
</script>
