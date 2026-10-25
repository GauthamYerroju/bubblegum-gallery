const config = require('config')
const mime = require('mime-types')
const sharp = require('sharp')
const { DefaultHandler } = require('./index.js')

class ImageHandler extends DefaultHandler {
  static name = 'ImageHandler'
  static handlesTypes = 'JPEG, PNG, WebP, TIFF, GIF, SVG'.split(', ').map(ext => mime.lookup('_.' + ext))

  static inspect (file) {
    return sharp(file).metadata()
      .then(meta => {
        // Animated images report the height of all frames stacked; pageHeight is one frame
        return { width: meta.width, height: meta.pageHeight || meta.height }
      })
  }

  static saveThumbnail (file, dest) {
    // Fit inside a size x size box, keeping aspect ratio. Animated GIFs stay animated
    // (dest ends in .gif for them); everything else is written as PNG to keep transparency,
    // from the first frame only: PNG can't animate, and reading all frames of an animated WebP
    // or multi-page TIFF into a PNG stacks them into one tall strip.
    const size = config.get('thumbnail.size')
    return sharp(file, { animated: dest.endsWith('.gif') })
      .resize(size, size, { fit: 'inside' })
      .toFile(dest)
      .then(() => dest)
      .catch(err => {
        console.error(`Cannot create thumbnail for ${file}: ${err.message}`)
        throw err
      })
  }
}

module.exports = { ImageHandler }
