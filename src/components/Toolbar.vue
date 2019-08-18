<template lang="pug">
  div.toolbar
    nav.navbar.is-dark.is-fixed-top(role='navigation' aria-label='main navigation')
      .navbar-brand
        a.navbar-burger.burger(role='button' aria-label='menu' aria-expanded='false' data-target='navbar-menu' :class="{ 'is-active': isMenuOpen }" @click="toggleBurgerMenu")
          span(aria-hidden='true')
          span(aria-hidden='true')
          span(aria-hidden='true')
      #navbar-menu.navbar-menu(:class="{ 'is-active': isMenuOpen }")
        .navbar-start
          nav.level.breadcrumb.has-succeeds-separator(aria-label="breadcrumbs")
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
                a(href="#" :class="{'has-text-light': (i == parts.length - 1)}") {{ part }}
        .navbar-end
          .navbar-item
            .buttons.has-addons
              a.button.is-dark(@click="appSetSortBy('alpha')" :class="{'is-primary': appSortBy === 'alpha'}")
                span.icon
                  i.fas.fa-font
              a.button.is-dark(@click="appSetSortBy('mtime')" :class="{'is-primary': appSortBy === 'mtime'}")
                span.icon
                  i.fas.fa-clock
              a.button.is-dark(@click="appSetSortBy('type')" :class="{'is-primary': appSortBy === 'type'}")
                span.icon
                  i.fas.fa-shapes
              a.button.is-dark(@click="appSetSortBy('size')" :class="{'is-primary': appSortBy === 'size'}")
                span.icon
                  i.fas.fa-chart-bar
          .navbar-item
            a.button.is-dark(@click="appSetSortAsc(!appSortAsc)")
              span.icon
                i.fas(:class="`fa-sort-amount-down${appSortAsc ? '-alt' : ''}`")
          .navbar-item
            a.button.is-dark(@click="appSetSegment(!appSegment)" :class="{'is-primary': appSegment}")
              span.icon
                i.fas.fa-list-ul
          .navbar-item
            a.button.is-dark(@click="goToSettings")
              span.icon
                i.fas.fa-cog
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Toolbar',
  data () {
    return {
      isMenuOpen: false
    }
  },
  computed: {
    ...mapGetters({
      appPath: 'app/getPath',
      appSortBy: 'app/getSortBy',
      appSortAsc: 'app/getSortAsc',
      appSegment: 'app/getSegment'
    }),
    parts () {
      return (this.appPath === '') ? [] : this.appPath.split('/')
    }
  },
  methods: {
    ...mapActions({
      appSetPath: 'app/setPath',
      appSetSortBy: 'app/setSortBy',
      appSetSortAsc: 'app/setSortAsc',
      appSetSegment: 'app/setSegment'
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
