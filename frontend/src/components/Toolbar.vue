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
              a.button.is-dark(aria-label="Switch to database view" @click="appMode = 'search'" :class="{'is-info': appMode === 'search'}")
                fa-icon(icon="database" aria-hidden="true" title="Database view")
              a.button.is-dark(aria-label="Switch to folder view" @click="appMode = 'path'" :class="{'is-info': appMode === 'path'}")
                fa-icon(icon="folder" aria-hidden="true" title="Folder view")
          .navbar-item(v-if="appMode === 'search'")
            input.input(
              type="text"
              ref="searchbar"
              v-model="searchText"
              @keydown.enter="appSearchSpec = searchText"
            )
          nav.level.breadcrumb(aria-label="breadcrumbs" v-if="appMode === 'path'")
            ul
              li(@click="setPath(-1)")
                a(aria-label="Go home")
                  fa-icon(icon="home" title="Home" aria-hidden="true")
              li(
                v-for="(part, i) in parts"
                :key="i"
                :class="{'is-active': (i == parts.length - 1)}"
                @click="setPath(i)"
              )
                a(:class="{'has-text-light': (i == parts.length - 1)}") {{ part }}
        .navbar-end
          .navbar-item
            .buttons.has-addons
              a.button.is-dark(aria-label="Sort by name" @click="appSortBy = 'name'" :class="{'is-info': appSortBy === 'name'}")
                fa-icon(aria-hidden="true" title="Sort by name" icon="font")
              a.button.is-dark(aria-label="Sort by date" @click="appSortBy = 'mtime'" :class="{'is-info': appSortBy === 'mtime'}")
                fa-icon(aria-hidden="true" title="Sort by date" icon="clock")
              a.button.is-dark(aria-label="Sort by type" @click="appSortBy = 'type'" :class="{'is-info': appSortBy === 'type'}")
                fa-icon(aria-hidden="true" title="Sort by type" icon="shapes")
              a.button.is-dark(aria-label="Sort by size" @click="appSortBy = 'size'" :class="{'is-info': appSortBy === 'size'}")
                fa-icon(aria-hidden="true" title="Sort by size" icon="chart-bar")
          .navbar-item
            a.button.is-dark(aria-label="Toggle sort order" @click="appSortAsc = !appSortAsc")
              fa-icon(aria-hidden="true" title="Toggle sort order" :icon="`sort-amount-down${appSortAsc ? '-alt' : ''}`")
          .navbar-item
            a.button.is-dark(aria-label="Group items" @click="appSegment = !appSegment" :class="{'is-info': appSegment}")
              fa-icon(aria-hidden="true" title="Group items" icon="list-ul")
          .navbar-item
            router-link.button.is-dark(to="/settings" aria-label="Open Settings")
              fa-icon(aria-hidden="true" title="Settings" icon="cog")
</template>

<script>
import { mapWritableState } from 'pinia'
import { useAppStore } from '@/stores/app'

export default {
  name: 'Toolbar',
  data () {
    return {
      isMenuOpen: false,
      searchText: ''
    }
  },
  computed: {
    ...mapWritableState(useAppStore, {
      appMode: 'mode',
      appPath: 'path',
      appSearchSpec: 'searchSpec',
      appSortBy: 'sortBy',
      appSortAsc: 'sortAsc',
      appSegment: 'segment'
    }),
    parts () {
      return (this.appPath === '') ? [] : this.appPath.split('/')
    }
  },
  created () {
    this.searchText = this.appSearchSpec
  },
  methods: {
    setPath (i) {
      this.appPath = (i === -1) ? '' : this.parts.slice(0, i + 1).join('/')
    },
    toggleBurgerMenu () {
      this.isMenuOpen = !this.isMenuOpen
    }
  }
}
</script>
