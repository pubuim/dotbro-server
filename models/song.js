'use strict'

const crypto = require('crypto')

function genId (data) {
  return crypto.createHash('sha1').update(Date.now + Math.random() + (data + '')).digest('hex')
}

class Song {
  constructor (options) {
    Object.assign(this, {
      name: null,
      singer: null,
      album: null,
      image: null,
      orderer: null,
      playing: false
    }, options)
  }

  get id () {
    if (!this.$id) {
      this.$id = genId(this.name)
    }
    return this.$id
  }
}

module.exports = Song
