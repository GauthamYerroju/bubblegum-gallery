<template lang="pug">
  div.about
    HeaderBar(name="Settings")
    h1.title Settings
    p
      | Settings go here. Use Vuex to centralize the settings object, load it from env/file/defaults
    p
      button.button.is-info(@click="callIndex") Scan Folder
    About
</template>

<script>
// @ is an alias to /src
import { mapActions } from 'vuex'
import HeaderBar from '@/components/HeaderBar.vue'
import About from '@/components/About.vue'

export default {
  name: 'Settings',
  components: {
    HeaderBar,
    About
  },
  methods: {
    ...mapActions({
      apiDoScan: 'api/doScan'
    }),
    callIndex () {
      this.apiDoScan()
        .then(result => {
          console.log(result)
          alert('Indexed!')
        })
        .catch(err => {
          console.error(err)
          alert('Error!')
        })
    }
  }
}
</script>
