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
          nav.breadcrumb(aria-label="breadcrumbs")
            ul
              li(@click="setPath(-1)")
                a.is-paddingless
                  span.icon
                    i.fas.fa-home(aria-hidden="true")
              li(
                v-for="(part, i) in parts"
                :key="i"
                :class="{'is-active': (i == parts.length - 1)}"
                @click="setPath(i)"
              )
                a(href="#") {{ part }}
        .navbar-end
          .navbar-item
            a.button(fixed @click="goToSettings()")
              span.icon
                i.fas.fa-sliders-h

</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Toolbar',
  data () {
    return {
      isMenuOpen: false
    }
  },
  props: {
    path: {
      type: String,
      default: ''
    }
  },
  computed: {
    parts () {
      return this.path.split('/')
    }
  },
  methods: {
    ...mapActions({
      appSetPath: 'app/setPath'
    }),
    setPath (i) {
      if (i === -1) {
        this.appSetPath('')
      } else {
        this.parts.splice(i + 1)
        this.appSetPath(this.parts.join('/'))
      }
    },
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
