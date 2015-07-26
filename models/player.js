'use strict'

const lame = require('lame')
const Speaker = require('speaker')
const request = require('request')

class Player {

  constructor (getSong) {
    this.stream = null
    this.getSong = getSong
  }

  play (song) {
    if (!song) { return }
    let resourceUrl = song.resourceUrl
    if (!resourceUrl) { throw new Error('Invalid song data') }

    this.stream = request(resourceUrl)
      .pipe(new lame.Decoder())
      .on('format', function (format) {
        this.pipe(new Speaker(format))
      })
      .on('end', () => this.play(this.getSong()))
  }

}

module.exports = Player
