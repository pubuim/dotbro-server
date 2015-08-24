'use strict'

const lame = require('lame')
const Speaker = require('speaker')
const request = require('request')

class Player {

  constructor (playlist) {
    this.stream = null
    this.playlist = playlist
  }

  play (song) {
    if (song.playing) { throw new Error('Cannot replay the song') }
    song.playing = true

    this.stream = request(song.resourceUrl)
      .on('error', () => this.activate(true))
      .pipe(new lame.Decoder())
      .on('format', function (format) {
        this.pipe(new Speaker(format))
      })
      .on('end', () => {
        console.log(`Ended song: [${song.name}]<id: ${song.id}>`)
        this.stream = null
        this.activate(true)
      })
  }

  activate (force) {
    if (!force && this.stream) { return } // activated

    let song = this.playlist.get()
    if (!song) {
      console.warn('The playlist is empty')
      return
    }

    if (song.playing) { // ended now
      this.playlist.remove(song.id, true)
      return this.activate(force)
    }

    this.play(song)
    console.log(`Playing song: [${song.name}]<id: ${song.id}>`)
  }

}

module.exports = Player
