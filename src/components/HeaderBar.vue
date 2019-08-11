<template lang="pug">
  div.header-bar
    //- Add blank navbar for additional padding when fixed
    nav.navbar(v-if="fixed")
    nav.navbar(:class="{ 'is-fixed-top': fixed }")
      .navbar-menu
        .navbar-start
          a.navbar-item
            span {{ name }}
        .navbar-end
          .navbar-item
            a.delete.is-large(@click="close")

</template>

<script>
export default {
  name: 'HeaderBar',
  props: {
    name: String,
    fixed: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    close () {
      this.$router.go(-1)
      // this.$router.replace(this.$route.params.comingFrom || '/')
    }
  }
}
</script>
