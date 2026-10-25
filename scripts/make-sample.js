// Generates a small test collection in ./sample-media using the bundled ffmpeg (ffmpeg-static).
// Covers the shapes and types the gallery has to cope with: wide, ultrawide, panorama, portrait,
// very tall, square, animated GIF, video, WebP, a non-media file and subfolders, with modification
// times spread from today to three years ago so date grouping has something to show.
// Usage: npm run sample [-- <target dir>]
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')
const ffmpeg = require('ffmpeg-static')

const root = path.resolve(process.argv[2] || path.join(__dirname, '..', 'sample-media'))
const DAY = 24 * 60 * 60 * 1000

// [file, lavfi source, extra output args, age in days]
const items = [
  ['square-bars.jpg', 'smptebars=size=1000x1000', [], 0],
  ['panorama-5x1.jpg', 'gradients=size=3000x600:seed=11', [], 0],
  ['square-rgb.png', 'rgbtestsrc=size=600x600', [], 1],
  ['landscapes/mandelbrot-wide.png', 'mandelbrot=size=1920x1080', [], 1],
  ['landscapes/ultrawide-testsrc.jpg', 'testsrc2=size=2560x1080', [], 4],
  ['portraits/gradient-phone.jpg', 'gradients=size=900x1600:seed=7', [], 4],
  ['landscapes/gradient-16x9.jpg', 'gradients=size=1600x900:seed=3', [], 10],
  ['portraits/mandelbrot-tall.png', 'mandelbrot=size=1000x1500:start_scale=1', [], 40],
  ['landscapes/cellauto-3x2.png', 'cellauto=size=1200x800:rule=110', [], 40],
  ['portraits/life-very-tall.png', 'life=size=800x2400:mold=10:ratio=0.3', [], 200],
  ['misc/sierpinski.png', 'sierpinski=size=1024x1024', [], 200],
  ['misc/spectrum.webp', 'testsrc=size=1280x720', [], 500],
  ['misc/life-anim.gif', 'life=size=320x240:rate=10', ['-t', '3'], 3 * 365],
  ['misc/clip.mp4', 'testsrc=size=640x360:rate=24', ['-t', '3', '-pix_fmt', 'yuv420p'], 3 * 365]
]

const now = Date.now()
for (const [file, source, extra, ageDays] of items) {
  const dest = path.join(root, file)
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  const single = extra.includes('-t') ? [] : ['-frames:v', '1', '-update', '1']
  execFileSync(ffmpeg, ['-loglevel', 'error', '-y', '-f', 'lavfi', '-i', source, ...single, ...extra, dest])
  const t = new Date(now - ageDays * DAY)
  fs.utimesSync(dest, t, t)
  console.log(file)
}
fs.writeFileSync(path.join(root, 'misc', 'notes.txt'), 'Not an image; the gallery should skip it.\n')
console.log(`Sample media written to ${root}`)
