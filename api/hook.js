/**
 * Created by trigged on 7/25/15.
 */
const WYMusic = require("../services/wymusic")
const Regex = require('../services/regex')
const MusicHandler = require("../services/index")


var music = {
  receive: function *() {
    let body = this.request.body
    let text = body.trigger_word ? body.text.substr(body.trigger_word.length).trim() : body.text

    let urlMatched = text.match(Regex.url)

    if (!urlMatched) {
      return this.body = {
        text: '无法解析地址'
      }
    }

    try {
      var ret = yield MusicHandler(urlMatched[0])
      this.body = {
        text: '音乐添加完成：' + ret.name,
        attachments: [{
          title: ret.name,
          url: urlMatched[1],
          photoUrl: ret.image,
          desription: ret.album
        }]
      }
    } catch (err) {
      this.body = {
        text: '音乐添加失败：' + err.message
      }
    }
  }
};

module.exports = music
