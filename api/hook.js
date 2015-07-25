/**
 * Created by trigged on 7/25/15.
 */
const WYMusic = require("../services/wymusic")
const Regex = require('../services/regex')


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

    let ret = yield WYMusic.analysis(urlMatched[1])
    // TODO 需要等待 API 完成后实现添加和返回逻辑

    this.body = {
      text: '音乐添加完成：' + ret
    }
  }
};

module.exports = music