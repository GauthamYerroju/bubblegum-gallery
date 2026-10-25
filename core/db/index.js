const config = require('config')
const { DatabaseSync } = require('node:sqlite')
const query = require('./query.js')

// NOTE: Relying on IIFE for singleton behavior (multiple imports, one connection)
const instance = (() => {
  // Connect to database
  const db = new DatabaseSync(config.get('db.file'))
  if (config.get('db.wal')) {
    db.exec('PRAGMA journal_mode = WAL;')
  }
  // Callers pass whole item objects as parameters; ignore keys a statement doesn't use (as better-sqlite3 did)
  const prepare = (sql) => {
    const stmt = db.prepare(sql)
    stmt.setAllowUnknownNamedParameters(true)
    if (config.get('db.verbose')) {
      for (const method of ['run', 'get', 'all', 'iterate']) {
        const fn = stmt[method].bind(stmt)
        stmt[method] = (...args) => { console.log(sql); return fn(...args) }
      }
    }
    return stmt
  }

  // Init tables and prepare statements
  const st = {}
  for (const [k, v] of Object.entries(query)) {
    k.startsWith('create') ? db.exec(v) : st[k] = prepare(v)
    // Search statements are created on demand and cached.
    // Why? "ORDER BY col_name" doesn't work in db.prepare() because it becomes "ORDER BY 'col_name'".
    st._cache = {}
    st.search = (orderby, desc, limit, offset) => {
      // Limit and offset values don't matter, just whether they exist or not
      const key = [orderby, desc, (limit !== undefined), (offset !== undefined)]
      if (!(st._cache[key])) {
        let stmt = 'SELECT * FROM file_info WHERE name LIKE @name'
        if (orderby) stmt = `${stmt} ORDER BY ${orderby}`
        if (desc) stmt = `${stmt} DESC`
        stmt = `${stmt}, name`
        if (limit) stmt = `${stmt} LIMIT @limit`
        if (offset) stmt = `${stmt} offset @offset`
        stmt = `${stmt};`
        st._cache[key] = prepare(stmt)
        console.warn('!!! Statement prepared for:', key)
      }
      return st._cache[key]
    }
  }

  // Public methods
  return {
    _db: db,
    // Files
    addFile (info) {
      st.addFile.run(info)
    },
    removeFileById (id) {
      return st.removeFileById.run({ id })
    },
    getFileByPath (path) {
      return st.getFileByPath.get({ path })
    },
    // Thumbs
    addThumb (info) {
      return st.addThumb.run(info)
    },
    removeThumb (xxhash) {
      return st.removeThumb.run({ xxhash })
    },
    getThumb (xxhash) {
      return st.getThumb.get({ xxhash })
    },
    // Search
    searchPage (name, orderby = 'name', desc = false, limit, offset) {
      const values = { name: `%${name}%`, orderby, desc, limit, offset }
      return st.search(orderby, desc, limit, offset).all(values)
    },
    searchIter (name, orderby = 'name', desc = false) {
      const values = { name: `%${name}%`, orderby, desc }
      return st.search(orderby, desc).iterate(values)
    }
  }
})()

module.exports = instance
