/**
 * Created by trigged on 7/25/15.
 */
const MusicHandler = require("../services/index")
  , Song = require("../models/song")
  , playlist = require("../models/playlist")


var music = {
  list: function *() {
    // this.body = playlist.values()

    // @TODO dummy
    this.body = {
      code: 0,
      data: [
        {
          "id" : 1,
          "name" : "くず",
          "singer" :"野郎",
          "album" : "Asshole Collection",
          "image" : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKyV1WnmyHWfI5ArjllzPrs6e9afnt0IDIdmNDKGZpY6_14p5y",
          "orderer" : "unknown"
        },
        {
          "id" : 2,
          "name" : "羊驼之歌",
          "singer" :"unknown",
          "album" : "unknown",
          "image" : "http://i1.hdslb.com/320_180/video/71/71d693f57f3c91703859148265bffa75.jpg",
          "orderer" : "unknown"
        }
      ]
    }
  },

  add: function *() {
    var result  = yield MusicHandler(this.request.body.url)
    //if(is_string(result)){
      this.body = {
        code : 0,
        error_desc : result
      }
    //}
    //var song =new Song(this.body)

  },

  remove: function *(wyID) {
    this.body = `remove ${wyID}`
  }
};
module.exports = music
