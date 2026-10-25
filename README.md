# bubblegum-gallery

A local gallery for browsing a folder of images and videos in the browser, by folder or through a searchable index.

| Folder | What it is |
|---|---|
| `core/` | Library: walks folders, indexes files in SQLite, hashes them, makes thumbnails |
| `server/` | Express API on port 3000 over `core` |
| `frontend/` | Vue web app on port 8080 |

## Run

Needs Node 25 or newer. Nothing else: SQLite is built into Node, and ffmpeg ships as an npm package.

```bash
npm install
npm run sample        # optional: generate a small test collection in ./sample-media
npm run dev           # starts server and frontend; open http://localhost:8080
```

`npm run dev` serves `./sample-media` by default. To browse another folder:

```bash
npm run dev -- "D:/Pictures"
```

or set `BUBBLEGUM_MEDIA` to that folder. The index (`data.db`) and thumbnails are written to `server/`.

Folder view works straight away. Search (database) view only shows files after a scan: Settings > Scan Folder.

## History

This repo merges three earlier repos, with their histories kept: `bubblegum-gallery` (now `frontend/`), `bubblegum-core` (`core/`) and `bubblegum-server` (`server/`).
