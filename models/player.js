'use strict'

const lame = require('lame')
const Speaker = require('speaker')
const request = require('request')

class Player {

  constructor(playlist) {
    this.stream = null
    this.speaker = null
    this.playlist = playlist
  }

  play(song) {
    if (!song) return this.activate()
    if (song.playing) { throw new Error('Cannot replay the song') }
    song.playing = true

    let that = this

    this.stream = request(song.resourceUrl)
      .on('error', () => this.activate(true))
      .pipe(new lame.Decoder())
      .on('format', function (format) {
        that.speaker = new Speaker(format)
        this.pipe(that.speaker)
      })
      .on('end', () => {
        console.log(`Ended song: [${song.name}]<id: ${song.id}>`)
        this.stream = null
        that.speaker = null
        this.activate(true)
      })
  }

  next() {
    return this.activate(true)
  }

  stop() {
    try {
      if (this.stream) {
        this.stream.unpipe()
        this.stream = null
      }

      if (this.speaker) {
        this.speaker.close()
        this.speaker = null
      }
    } catch (err) {
      console.error(`Stop error: ${err.stack}`)
    }
  }

  activate(force) {
    if (!force && this.stream) { return } // activated

    let song = this.playlist.get()
    if (!song) {
      console.warn('The playlist is empty')
      return
    }

    if (song.playing) { // ended now
      this.stop()
      this.playlist.remove(song.id, true)
      return this.activate(force)
    }

    this.play(song)
    console.log(`Playing song: [${song.name}] <id:${song.id}>`)

    return song
  }

}

module.exports = Player
