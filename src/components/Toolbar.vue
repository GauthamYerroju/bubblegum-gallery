<template lang="pug">
  div.toolbar
    nav.navbar
    nav.navbar.is-fixed-top(role='navigation' aria-label='main navigation')
      .navbar-brand
        a.navbar-burger.burger(role='button' aria-label='menu' aria-expanded='false' data-target='navbar-menu' :class="{ 'is-active': isMenuOpen }" @click="toggleBurgerMenu")
          span(aria-hidden='true')
          span(aria-hidden='true')
          span(aria-hidden='true')
      #navbar-menu.navbar-menu(:class="{ 'is-active': isMenuOpen }")
        .navbar-start
          a.navbar-item
            | Home
        .navbar-end
          .navbar-item
            a.button(fixed @click="goToSettings()")
              span.icon
                i.fas.fa-sliders-h

</template>

<script>
export default {
  name: 'Toolbar',
  data () {
    return {
      isMenuOpen: false
    }
  },
  methods: {
    toggleBurgerMenu () {
      this.isMenuOpen = !this.isMenuOpen
    },
    goToSettings () {
      this.$router.push({
        name: 'settings',
        params: {
          returnTo: {
            name: this.$route.name,
            params: this.$route.params
          }
        }
      })
    }
  }
}
</script>
