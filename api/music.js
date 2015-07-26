/**
 * Created by trigged on 7/25/15.
 */
const MusicHandler = require('../services/index')
  , playlist = require('../models/playlist')
  , Player = require('../models/player')

var player = new Player(() => playlist.shift())

setInterval(() => console.info(`There's ${playlist.count()} song(s) reserved`), 5 * 1000)

var music = {

  list: function* () {
    this.data = playlist.values(this.query.last_id, this.query.count)
  },

  add: function* () {
    console.info(`got: ${this.request.body.url}`)
    let song = yield MusicHandler(this.request.body.url, this.req.ip)
    playlist.add(song)
    if (!player.stream) { player.play(song) }
  },

  remove: function* () {
    if (!playlist.remove(this.query.ids)) {
      throw new Error(`Song: ${this.query.ids} is not exists or playing`)
    }
  }
};
module.exports = music
