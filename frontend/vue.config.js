// Workspaces hoist bulma to the repo root, where postcss can't find this package's config; point it here.
module.exports = {
  css: {
    loaderOptions: {
      postcss: { config: { path: __dirname } }
    }
  }
}
