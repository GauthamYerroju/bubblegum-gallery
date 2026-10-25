import neostandard from 'neostandard'
import pluginVue from 'eslint-plugin-vue'

// Standard style (as the Vue CLI setup used) plus Vue's recommended rules.
// Note: eslint-plugin-vue doesn't lint pug templates, only <script>.
export default [
  ...neostandard({ ignores: ['dist/**'] }),
  ...pluginVue.configs['flat/recommended'],
  {
    rules: {
      // Newer than this code base; renaming every component isn't worth it
      'vue/multi-word-component-names': 'off'
    }
  }
]
