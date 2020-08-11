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
          .navbar-item
            .buttons.has-addons
              a.button.is-dark(aria-label="Switch to database view" @click="appSetModeToSearch" :class="{'is-info': appMode === 'search'}")
                fa-icon(icon="database" aria-hidden="true" title="Database view")
              a.button.is-dark(aria-label="Switch to folder view" @click="appSetModeToPath" :class="{'is-info': appMode === 'path'}")
                fa-icon(icon="folder" aria-hidden="true" title="Folder view")
          .navbar-item(v-if="appMode === 'search'")
            input.input(
              type="text"
              ref="searchbar"
              v-model="searchText"
              @keydown.enter="appSetSearchSpec(searchText)"
            )
          nav.level.breadcrumb.has-succeeds-separator(aria-label="breadcrumbs" v-if="appMode === 'path'")
            ul
              li(@click="setPath(-1)")
                a.is-paddingless(aria-label="Go home")
                  fa-icon(icon="home" title="Home" aria-hidden="true")
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
              a.button.is-dark(aria-label="Sort by name" @click="appSetSortBy('name')" :class="{'is-info': appSortBy === 'name'}")
                fa-icon(aria-hidden="true" title="Sort by name" icon="font")
              a.button.is-dark(aria-label="Sort by date" @click="appSetSortBy('mtime')" :class="{'is-info': appSortBy === 'mtime'}")
                fa-icon(aria-hidden="true" title="Sort by date" icon="clock")
              a.button.is-dark(aria-label="Sort by type" @click="appSetSortBy('type')" :class="{'is-info': appSortBy === 'type'}")
                fa-icon(aria-hidden="true" title="Sort by type" icon="shapes")
              a.button.is-dark(aria-label="Sort by size" @click="appSetSortBy('size')" :class="{'is-info': appSortBy === 'size'}")
                fa-icon(aria-hidden="true" title="Sort by size" icon="chart-bar")
          .navbar-item
            a.button.is-dark(aria-label="Toggle sort order" @click="appSetSortAsc(!appSortAsc)")
              fa-icon(aria-hidden="true" title="Toggle sort order" :icon="`sort-amount-down${appSortAsc ? '-alt' : ''}`")
          .navbar-item
            a.button.is-dark(aria-label="Group items" @click="appSetSegment(!appSegment)" :class="{'is-info': appSegment}")
              fa-icon(aria-hidden="true" title="Group items" icon="list-ul")
          .navbar-item
            a.button.is-dark(aria-label="Open Settings" @click="goToSettings")
              fa-icon(aria-hidden="true" title="Settings" icon="cog")
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Toolbar',
  data () {
    return {
      isMenuOpen: false,
      searchText: ''
    }
  },
  computed: {
    ...mapGetters({
      appMode: 'app/getMode',
      appPath: 'app/getPath',
      appSearchSpec: 'app/getSearchSpec',
      appSortBy: 'app/getSortBy',
      appSortAsc: 'app/getSortAsc',
      appSegment: 'app/getSegment'
    }),
    parts () {
      return (this.appPath === '') ? [] : this.appPath.split('/')
    }
  },
  created () {
    this.searchText = this.appSearchSpec
  },
  methods: {
    ...mapActions({
      appSetPath: 'app/setPath',
      appSetSortBy: 'app/setSortBy',
      appSetSortAsc: 'app/setSortAsc',
      appSetSegment: 'app/setSegment',
      appSetModeToPath: 'app/setModeToPath',
      appSetModeToSearch: 'app/setModeToSearch',
      appSetSearchSpec: 'app/setSearchSpec'
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
