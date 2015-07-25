/**
 * Created by trigged on 7/25/15.
 */
const WYMusic = require("../services/wymusic")


var music = {
  list: function *() {
    this.body =  "list"
  },

  add :function *(){
    this.body = yield WYMusic.analysis(this.request.body.url)

  },
  remove: function *(wyID) {
    this.body =  `remove ${wyID}`
  }
};
module.exports = music