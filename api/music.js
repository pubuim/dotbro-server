/**
 * Created by trigged on 7/25/15.
 */
const WYMusic = require('../services/wymusic')
  , Song = require('../models/song')
  , playlist = require('../models/playlist')
  , _ = require('lodash')


var music = {
  list: function *() {
    this.data = playlist.values()
  },

  add: function *() {
    var result  = yield WYMusic.analysis(this.request.body.url)
    //if(is_string(result)){
      this.body = {
        code : 0,
        error_desc : result
      }
    //}
    //var song =new Song(this.body)

  },

  remove: function *(wyID) {
    if (!wyID) {
      throw new Error('ID is requred')
    }
    if (!playlist.remove(wyID)) {
      throw new Error(`Song: ${wyID} is not exists or playing`)
    }
  }
};
module.exports = music
