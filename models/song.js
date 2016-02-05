'use strict'

const crypto = require('crypto')

function genId (data) {
  return crypto.createHash('sha1').update(Date.now + Math.random() + (data + '')).digest('hex')
}

class Song {
  constructor (options) {

    Object.defineProperties(this, {
      $id: {
        writable: true,
        enumerable: false,
        value: genId()
      },
      id: {
        enumerable: true,
        get: () => this.$id,
        set: (id) => {this.$id = id}
      }
    })

    Object.assign(this, {
      name: null,
      singer: null,
      album: null,
      image: null,
      resourceUrl:null,
      orderer: null,
      playing: false
    }, options)

  }
}

module.exports = Song
