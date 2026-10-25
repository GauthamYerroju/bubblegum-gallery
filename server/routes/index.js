var path = require('path')
var process = require('process')
var express = require('express');
var router = express.Router();
var mime = require('mime-types')
var createError = require('http-errors')
var { iterDir, getFileData, getFileDataBatch, searchDb } = require("bubblegum-core")

// TODO: why do I need config/default.json? Figure it out.
// TODO: define settings in bubblegum-core, expose it in bubblegum-server and bubblegum-gallery

// Commandline args (quick and dirty argparser), falling back to env vars, then defaults
var argSpec = {
  1: {
    name: 'home',
    env: 'BUBBLEGUM_MEDIA',
    default: path.resolve(__dirname, '../../sample-media')
  },
  2: {
    name: 'thumbs',
    env: 'BUBBLEGUM_THUMBS',
    default: path.resolve(process.cwd(), 'thumbnails')
  }
}
var argv = {}
for (var [i, spec] of Object.entries(argSpec)) {
  argv[spec.name] = path.resolve(process.argv[1 + Number(i)] || process.env[spec.env] || spec.default)
}
console.table(argv)
// Fail fast on a wrong media folder instead of serving an empty gallery
if (!require('fs').statSync(argv.home, { throwIfNoEntry: false })?.isDirectory()) {
  console.error(`Media folder not found: ${argv.home}`)
  process.exit(1)
}

// Resolves a client-supplied path against root; null if it points outside root
function resolveInside (root, p) {
  var full = path.resolve(root, p || '')
  var rel = path.relative(root, full)
  if (rel === '..' || rel.startsWith('..' + path.sep) || path.isAbsolute(rel)) return null
  return full
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/get-file', function (req, res, next) {
  var p = resolveInside(argv.home, req.query.path)
  if (!p) return next(createError(403))
  // sendFile 404s any path with a dot-segment by default; listdir shows dot-folders, so serve them
  // (resolveInside already keeps the path inside the media folder)
  return res.sendFile(p, { dotfiles: 'allow' })
});

router.get('/get-thumbnail', function (req, res, next) {
  var p = resolveInside(argv.thumbs, req.query.path)
  if (!p) return next(createError(403))
  return res.sendFile(p)
});

router.get('/listdir', function (req, res, next) {
  const homePath = resolveInside(argv.home, req.query.path)
  if (!homePath) return next(createError(403))
  const items = []
  for (const i of iterDir(homePath, false)) {
    i.mime = mime.lookup(i.path)
    items.push(i)
  }
  getFileDataBatch(items)
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: String(err && err.message || err) })
    })
});

router.get('/search', function (req, res, next) {
  const q = req.query.q || ''
  const orderBy = req.query.sortBy || 'name'
  const desc = !(req.query.sortAsc === 'true')
  const limit = req.query.limit || 80 // TODO: remove default here after pagination is implemented in ui
  const offset = req.query.offset || 0
  searchDb(q, orderBy, desc, limit, offset)
    .then(result => {
      res.json(result)
    })
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: String(err && err.message || err) })
    })
});

router.get('/scan', function (req, res, next) {
  const batchSize = req.query.batchSize || 10 // TODO: move scan batch size to config in UI
  const fillBatch = (iterator) => {
    const batch = []
    for (let i = 0; i < batchSize; i++) {
      let item = iterator.next()
      if (item.done) break;
      batch.push(item.value)
    }
    return batch
  }
  const recursivePromise = (iterator) => {
    const batch = fillBatch(iterator)
    return getFileDataBatch(batch, true)
      .then(() => batch.length ? recursivePromise(iterator) : null)
  }
  // One response at the end: an error stops the scan instead of answering and carrying on
  recursivePromise(iterDir(path.resolve(argv.home), true))
    .then(() => res.json({ message: 'Indexing succesful.' }))
    .catch(err => {
      console.error(err)
      res.status(500).json({ message: String(err && err.message || err) })
    })
});

module.exports = router;
