/**
 * Created by trigged on 7/25/15.
 */
const MusicHandler = require('../services/index')
  , playlist = require('../models/playlist')


var music = {

  list: function* () {
    this.data = playlist.values(this.query.last_id, this.query.count)
  },

  add: function* () {

    var result = yield MusicHandler(this.req.query.url, this.req.ip)
    //if(is_string(result)){
      this.body = {
        code : 0,
        error_desc : result
      }
    //}
    //var song =new Song(this.body)

  },

  remove: function* () {
    if (!playlist.remove(this.query.ids)) {
      throw new Error(`Song: ${this.query.ids} is not exists or playing`)
    }
  }
};
module.exports = music
