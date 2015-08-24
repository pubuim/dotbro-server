/**
 * Created by trigged on 7/25/15.
 */
const MusicHandler = require('../services/index')
const PlayerService = require('../services/player')

var music = {

  list: function* () {
    this.data = PlayerService.playlist.values(this.query.last_id, this.query.count)
  },

  add: function* () {
    console.info(`Got: ${this.request.body.source_url}`)

    let song = yield MusicHandler(this.request.body.source_url, this.request.body.orderer)
    this.data = song

    PlayerService.playlist.add(song)
    PlayerService.activate()

    console.log(`Added song: [${song.name}]<id: ${song.id}>`)
  },

  remove: function* () {
    this.data = PlayerService.playlist.remove(this.query.ids)
  }
};
module.exports = music
