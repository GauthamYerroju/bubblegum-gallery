<template lang="pug">
  div.about
    HeaderBar(name="Settings")
    h1.title Settings
    p Settings go here. Use Vuex to centralize the settings object, load it from env/file/defaults
    router-link(to="/about") About
</template>

<script>
// @ is an alias to /src
import HeaderBar from '@/components/HeaderBar.vue'

export default {
  name: 'settings',
  components: {
    HeaderBar
  }
}
</script>
