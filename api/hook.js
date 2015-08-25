/**
 * Created by trigged on 7/25/15.
 */
const WYMusic = require("../services/wymusic")
const Regex = require('../services/regex')
const MusicHandler = require("../services/index")
const PlayerService = require('../services/player')

var music = {
  receive: function *() {
    let body = this.request.body
    let text = String(body.trigger_word ? body.text.substr(body.trigger_word.length).trim() : body.text).trim()

    if (!text) {
      let songs = PlayerService.playlist.values(this.query.last_id, this.query.count)

      let outputBody = this.body = {
        text: `当前共有 ${PlayerService.playlist.count()} 首音乐`,
        attachments: []
      }

      songs.forEach(function (song) {
        outputBody.attachments.push({
          title: song.name + (song.playing ? ' ►正在播放' : ''),
          photoUrl: song.image,
          description: song.album
        })
      })
    } else {
      let urlMatched = text.match(Regex.url)

      if (!urlMatched) {
        return this.body = {
          text: '无法解析地址'
        }
      }

      try {
        var song = yield MusicHandler(urlMatched[0])

        PlayerService.playlist.add(song)
        PlayerService.activate()

        this.body = {
          text: '音乐添加完成：' + song.name,
          attachments: [{
            title: song.name,
            url: urlMatched[0],
            photoUrl: song.image,
            description: song.album
          }],
          create: true
        }
      } catch (err) {
        this.body = {
          text: '音乐添加失败：' + err.message
        }
      }
    }
  }
};

module.exports = music
