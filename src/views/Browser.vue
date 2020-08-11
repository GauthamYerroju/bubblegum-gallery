<template lang="pug">
  div.browser.is-relative.has-text-light.has-background-dark
    div.loading-overlay.is-overlay(:class="{'is-hidden': !loading}")
    Toolbar(ref="toolbar")
    //- Sidebar
    Gallery(
      v-if="appGalleryKey && !loading"
      :items="galleryItems"
      :currentKey="appGalleryKey"
      @keyChange="appSetGalleryKey"
    )
    div(ref="lazyloadcontainer").scroll-container.full-height
      ItemContainer(
        v-for="renderItems in renderGroups"
        :items="renderItems.items"
        :key="renderItems.headerText"
        :headerText="renderItems.headerText"
        @open="openItem"
      )
      div.end-marker(
        ref="endMarker"
      ) End Marker
</template>

<script>
// @ is an alias to /src
import pathlib from 'path'
import slugify from 'slugify'
import LazyLoad from 'vanilla-lazyload'
import { groupBy, findKey } from 'lodash'
import { DateTime, Interval } from 'luxon'
import { mapActions, mapGetters } from 'vuex'
import Toolbar from '@/components/Toolbar.vue'
import Sidebar from '@/components/Sidebar.vue'
import Gallery from '@/components/Gallery.vue'
import ItemContainer from '@/components/ItemContainer.vue'

export default {
  name: 'Browser',
  components: {
    Toolbar,
    Sidebar,
    Gallery,
    ItemContainer
  },
  data () {
    return {
      path: '',
      searchSpec: '',
      dbItems: [],
      pathItems: [],
      loading: false,
      lazyLoader: {
        type: LazyLoad,
        default: null
      },
      observer: null,
      intervals: {
        today: {
          name: 'Today',
          sortIndex: 1,
          is: (now, t) =>
            Interval.after(now.startOf('day'), { days: 1 }).contains(t)
        },
        yesterday: {
          name: 'Yesterday',
          sortIndex: 2,
          is: (now, t) =>
            Interval.before(now.startOf('day'), { days: 1 }).contains(t)
        },
        thisWeek: {
          name: 'This Week',
          sortIndex: 3,
          is: (now, t) =>
            Interval.after(now.startOf('week'), { weeks: 1 }).contains(t)
        },
        lastWeek: {
          name: 'Last Week',
          sortIndex: 4,
          is: (now, t) =>
            Interval.before(now.startOf('week'), { weeks: 1 }).contains(t)
        },
        '2WeeksAgo': {
          name: '2 Weeks Ago',
          sortIndex: 5,
          is: (now, t) =>
            Interval.before(now.startOf('week'), { weeks: 2 }).contains(t)
        },
        '3WeeksAgo': {
          name: '3 Weeks Ago',
          sortIndex: 6,
          is: (now, t) =>
            Interval.before(now.startOf('week'), { weeks: 3 }).contains(t)
        },
        thisMonth: {
          name: 'This Month',
          sortIndex: 7,
          is: (now, t) =>
            Interval.after(now.startOf('month'), { months: 1 }).contains(t)
        },
        lastMonth: {
          name: 'Last Month',
          sortIndex: 8,
          is: (now, t) =>
            Interval.before(now.startOf('month'), { months: 1 }).contains(t)
        },
        thisYear: {
          name: 'This Year',
          sortIndex: 9,
          is: (now, t) =>
            Interval.after(now.startOf('year'), { years: 1 }).contains(t)
        },
        lastYear: {
          name: 'Last Year',
          sortIndex: 10,
          is: (now, t) =>
            Interval.before(now.startOf('year'), { years: 1 }).contains(t)
        },
        older: {
          name: 'Older',
          sortIndex: 11,
          is: (now, t) => t.year < now.year - 1
        },
        other: { name: 'Other', sortIndex: 12 }
      },
      sizes: {
        tiny: { name: 'Tiny', sortIndex: 1, is: size => true }
      }
    }
  },
  computed: {
    ...mapGetters({
      appMode: 'app/getMode',
      appPath: 'app/getPath',
      appSearchSpec: 'app/getSearchSpec',
      appSortBy: 'app/getSortBy',
      appSortAsc: 'app/getSortAsc',
      appPage: 'app/getPage',
      appSkipPages: 'app/getSkipPages',
      appItemsPerPage: 'app/getItemsPerPage',
      appSegment: 'app/getSegment',
      appGalleryKey: 'app/getGalleryKey'
    }),
    renderGroups () {
      if (this.appMode === 'search') {
        // DB mode: group by page
        this.dbItems.forEach(group => {
          group.items = this.postProcessItems(group.items)
        })
        return this.dbItems
      } else {
        // Folder mode: group by sorting
        if (this.appSegment) {
          return this.groupItems(this.pathItems, this.appSortBy)
        }
        return [{ items: this.postProcessItems(this.pathItems) }]
      }
    },
    galleryItems () {
      return this.renderGroups
        .map(group => group.items)
        .reduce((acc, cur) => acc.concat(cur), [])
    }
  },
  watch: {
    renderGroups: function (newVal, oldVal) {
      this.$nextTick(() => {
        this.lazyLoader.update()
      })
    },
    appMode (newMode, oldMode) {
      this.disableAutoPager()
      this.loadDefaultItems()
    },
    appPath (newPath, oldPath) {
      this.getPathItems(newPath)
        .then(currentPath => {
          this.path = currentPath
        })
        .catch(err => {
          this.appSetPath(this.path)
          this.handleError(err)
        })
    },
    appSearchSpec (newSpec, oldSpec) {
      this.appSetPage(1)
      this.getSearchItems(newSpec)
        .then(currentSearchSpec => {
          this.searchSpec = currentSearchSpec
        })
        .catch(err => {
          this.appSetSearchSpec(this.searchSpec)
          this.handleError(err)
        })
    },
    appSortBy (newVal, oldVal) {
      if (this.appMode === 'search') {
        this.appSetPage(1)
        this.getSearchItems(this.searchSpec).catch(this.handleError)
      }
    },
    appSortAsc (newVal, oldVal) {
      if (this.appMode === 'search') {
        this.appSetPage(1)
        this.getSearchItems(this.searchSpec).catch(this.handleError)
      }
    }
  },
  mounted: function () {
    this.lazyLoader = new LazyLoad({
      container: this.$refs.lazyloadcontainer
    })
    this.observer = new IntersectionObserver(([entry]) => {
      if (entry && entry.isIntersecting) {
        this.loadNextPage()
      }
    })
    window.addEventListener('keydown', this.onkey)
    this.appSetPage(1)
    this.loadDefaultItems()
  },
  beforeDestroy: function () {
    window.removeEventListener('keydown', this.onkey)
    this.observer.disconnect()
  },
  methods: {
    ...mapActions({
      appSetPath: 'app/setPath',
      appSetSearchSpec: 'app/setSearchSpec',
      appSetPage: 'app/setPage',
      appSetSkipPages: 'app/setSkipPages',
      appSetModeToPath: 'app/setModeToPath',
      appSetModeToSearch: 'app/setModeToSearch',
      appSetGalleryKey: 'app/setGalleryKey',
      apiGetPathItems: 'api/getPathItems',
      apiGetSearchItems: 'api/getSearchItems'
    }),
    enableAutoPager () {
      this.observer.observe(this.$refs.endMarker)
    },
    disableAutoPager () {
      this.observer.unobserve(this.$refs.endMarker)
    },
    groupItems (items, groupKey) {
      const now = DateTime.local()
      const sizes = this.sizes
      const intervals = this.intervals
      const rawGroups = groupBy(items, item => {
        if (groupKey === 'mtime') {
          const mtime = DateTime.fromMillis(parseFloat(item.mtime))
          return findKey(intervals, i => i.is && i.is(now, mtime)) || 'other'
        } else if (groupKey === 'size') {
          const size = parseInt(item.size)
          return findKey(sizes, s => s.is && s.is(size)) || 'other'
        } else if (groupKey === 'type') {
          return item.dir ? 'Folder' : item.ext || 'Unknown'
        }
        return 'dont-group'
      })
      return Object.entries(rawGroups)
        .map(([key, items]) => {
          // eslint-disable-next-line
          let sortKey = "";
          let headerText = ''
          if (key === 'dont-group') {
            sortKey = undefined
            headerText = undefined
          } else if (groupKey === 'mtime') {
            sortKey = intervals[key].sortIndex
            headerText = intervals[key].name
          } else if (groupKey === 'size') {
            sortKey = sizes[key].sortIndex
            headerText = sizes[key].name
          } else {
            sortKey = key
            headerText = key
          }
          return {
            sortKey,
            headerText,
            items: this.postProcessItems(items)
          }
        })
        .sort((a, b) => {
          const plusOne = this.appSortAsc ? 1 : -1
          // Folders always first
          if (a.sortKey === 'Folder') {
            if (b.sortKey === 'Folder') {
              return a.headerText === b.headerText
                ? 0
                : a.headerText < b.headerText
                  ? -1
                  : 1
            } else {
              return -1
            }
          }
          if (a.sortKey === b.sortKey) {
            // Tie-break by header text
            return a.headerText === b.headerText
              ? 0
              : a.headerText < b.headerText
                ? -1
                : 1
          } else {
            return a.sortKey < b.sortKey ? -plusOne : plusOne
          }
        })
    },
    postProcessItems (items) {
      const result = Array.from(items)
      result.forEach((item, i) => {
        item.key = slugify(`${item.name}-${item.mtime}-${item.xxhash}`)
      })
      return this.sortItems(result)
    },
    sortItems (items) {
      if (this.appMode === 'search') {
        return items
      }
      let sortKey = 'name'
      if (this.appSortBy === 'mtime') sortKey = 'mtime'
      else if (this.appSortBy === 'type') sortKey = 'ext'
      else if (this.appSortBy === 'size') sortKey = 'size'
      const plusOne = this.appSortAsc ? 1 : -1
      const result = Array.from(items)
      return result.sort((a, b) => {
        if (a[sortKey] === b[sortKey]) {
          // Tie-break by name
          return a.name === b.name ? 0 : a.name < b.name ? -1 : 1
        } else {
          return a[sortKey] < b[sortKey] ? -plusOne : plusOne
        }
      })
    },
    getPathItems (path) {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.apiGetPathItems(path)
          .then(({ data }) => {
            resolve(path)
            this.pathItems = data
          })
          .catch(err => {
            reject(err)
            this.handleError(err)
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    getSearchItems (searchSpec) {
      this.loading = true
      return new Promise((resolve, reject) => {
        this.disableAutoPager()
        this.apiGetSearchItems(searchSpec)
          .then(({ data }) => {
            if (this.appSkipPages !== 0) {
              // Just load the next page
              if (data.length > 0) {
                this.dbItems.push({
                  headerText:
                    this.appPage === 1 ? undefined : `Page ${this.appPage}`,
                  items: data
                })
                this.enableAutoPager()
              }
            } else {
              // Load all pages
              const items = []
              const pages = Math.ceil(data.length / this.appItemsPerPage)
              for (let i = 0; i < pages; i++) {
                const pageItems = data.slice(
                  i * this.appItemsPerPage,
                  (i + 1) * this.appItemsPerPage
                )
                if (pageItems.length === 0) {
                  this.appSetPage(i + 1)
                  break
                }
                items.push({
                  headerText: i === 0 ? undefined : `Page ${i + 1}`,
                  items: pageItems
                })
              }
              this.dbItems = items
              if (items.length > 0) {
                this.enableAutoPager()
              }
            }
            resolve(searchSpec)
          })
          .catch(err => {
            reject(err)
            this.handleError(err)
          })
          .finally(() => {
            this.loading = false
          })
      })
    },
    loadDefaultItems () {
      if (this.appMode === 'path') {
        this.getPathItems(this.appPath)
          .then(currentPath => {
            this.path = currentPath
            this.appSetPath(this.path)
          })
          .catch(this.handleError)
      } else {
        this.getSearchItems(this.appSearchSpec)
          .then(currentSearchSpec => {
            this.searchSpec = currentSearchSpec
            this.appSetSearchSpec(this.searchSpec)
          })
          .catch(this.handleError)
      }
    },
    loadNextPage () {
      this.appSetSkipPages(this.appPage)
      this.appSetPage(this.appPage + 1)
      this.getSearchItems(this.searchSpec)
        .catch(this.handleError)
        .finally(() => {
          this.appSetSkipPages(0)
        })
    },
    openItem (item) {
      if (this.loading) {
        return
      }
      if (this.appMode === 'path') {
        if (item.dir) {
          this.__openDir(item)
        } else {
          this.__openFile(item)
        }
      } else {
        this.__openFile(item)
      }
    },
    __openDir (item) {
      const newPath = pathlib.join(this.path, item.name)
      this.appSetPath(newPath)
    },
    __openFile (item) {
      this.appSetGalleryKey(item.key)
    },
    onkey (ev) {
      if (this.appMode === 'search' && ev.altKey && ev.code === 'KeyF') {
        this.$refs.toolbar.$refs.searchbar.focus()
        ev.preventDefault()
      }
    },
    handleError (err) {
      console.error(err)
      alert(err)
    }
  }
}
</script>

<style scoped>
.browser {
  height: 100%;
  padding-top: 3.25rem; /* For fixed top toolbar */
}
.loading-overlay {
  z-index: 100;
  background: rgba(0, 0, 0, 0.5);
}
</style>
