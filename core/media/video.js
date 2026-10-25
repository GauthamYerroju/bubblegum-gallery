const config = require('config')
const mime = require('mime-types')
const { execFile } = require('child_process')
const { promisify } = require('util')
const ffmpegPath = require('ffmpeg-static')
const ffprobePath = require('ffprobe-static').path
const { DefaultHandler } = require('./index.js')

const run = promisify(execFile)

class VideoHandler extends DefaultHandler {
  static name = 'VideoHandler'
  static handlesTypes = 'AVI, MP4, WEBM, MKV, FLV'.split(', ').map(ext => mime.lookup('_.' + ext))

  static inspect (file) {
    const args = ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', file]
    return run(ffprobePath, args)
      .then(({ stdout }) => {
        const stream = JSON.parse(stdout).streams.find(stream => stream.width)
        if (stream) {
          return { width: stream.width, height: stream.height }
        }
        throw { error: { message: 'Cannot find metadata', data: stdout } } // eslint-disable-line no-throw-literal
      })
  }

  static saveThumbnail (file, dest) {
    // First frame, scaled to thumbnail.size wide (height keeps the aspect ratio, rounded to even)
    const size = config.get('thumbnail.size')
    const args = ['-v', 'error', '-y', '-i', file, '-frames:v', '1', '-vf', `scale=${size}:-2`, '-update', '1', dest]
    return run(ffmpegPath, args)
      .then(() => dest)
      .catch(err => {
        console.error(`Cannot create thumbnail for ${file}: ${err.message}`)
        throw err
      })
  }
}

module.exports = { VideoHandler }
