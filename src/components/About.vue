<template lang="pug">
  div.about
    h1 Bubblegum Gallery
    p Version information, current status, license, and information from server through props goes here.
    h2 Icons
      ul
        li
          a(href="https://fontawesome.com") Font Awesome
        li
          span Icons made by
          a(href="https://www.flaticon.com/authors/smashicons" title="Smashicons") smashicons
          span from
          a(href="https://www.flaticon.com/" title="Flaticon") www.flaticon.com
          span is licensed by
          a(href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank") CC 3.0 BY
</template>

<script>
export default {
  name: 'About'
}
</script>
