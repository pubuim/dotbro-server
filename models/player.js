'use strict'

const lame = require('lame')
const Speaker = require('speaker')
const request = require('request')

let stream

module.exports = {

  start: resourceURL => {
    stream = request(resourceURL)
      .pipe(new lame.Decoder())
      .on('format', function (format) {
        this.pipe(new Speaker(format))
       })
    return stream
  },

  stop: () => {
    return stream.end()
  }

}
