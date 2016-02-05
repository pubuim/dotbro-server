/**
 * Created by trigged on 7/25/15.
 */
const WYMusic = require("../services/wymusic")
const Regex = require('../services/regex')
const MusicHandler = require("../services/index")
const PlayerService = require('../services/player')

let searchResults = {}

var music = {
  convertToMessage: function (song, prefix) {
    return {
      text: (prefix || '音乐添加完成') + '：' + song.name,
      attachments: [{
        title: `${song.name} (${song.singer || song.artists.join(',')})`,
        photoUrl: song.image,
        description: `${song.album} by ${song.orderer}`
      }],
      create: true
    }
  },
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
      this.body = {
        text: '无法处理'
      }

      try {
        if (!urlMatched) {
          switch (text) {
            case 'next':
              let song = PlayerService.next()

              if (song) {
                this.body = music.convertToMessage(song, '已进入下一首')
              } else {
                this.body.text = '没有更多音乐'
              }
              break;
            default:
              if (/^\d+$/.test(text)) {
                let playNo = parseInt(text, 10)
                if (playNo <= 100 && searchResults[body.user_name]) {
                  let song = searchResults[body.user_name][playNo - 1]
                  if (song) song = yield WYMusic.get(song.id, body.user_name)

                  if (!song) {
                    this.body.text = `音乐添加失败, 没有 ID ${text}`
                  } else {
                    PlayerService.playlist.add(song)
                    PlayerService.activate()
                    this.body = music.convertToMessage(song)
                  }
                } else {
                  // 按照 ID 添加
                  let song = yield WYMusic.get(text, body.user_name)
                  if (!song) {
                    this.body.text = `音乐添加失败, 没有 ID ${text}`
                  } else {
                    PlayerService.playlist.add(song)
                    PlayerService.activate()
                    this.body = music.convertToMessage(song)
                  }
                }
              } else {
                // 搜索
                let songs = yield WYMusic.search(text, body.user_name)
                searchResults[body.user_name] = songs
                if (songs && songs[0]) {
                  this.body.text = `找到 ${songs.length} 首音乐: (输入序号点歌)`
                  this.body.attachments = songs.map(function (song, i) {
                    return {
                      title: `${i + 1}  ${song.name} (${song.artists.join(',')})`
                    }
                  })
                }
              }
          }
        } else {
          let song = yield MusicHandler(urlMatched[0], (body.user_name || '匿名') + '@瀑布')

          PlayerService.playlist.add(song)
          PlayerService.activate()

          this.body = {
            text: '音乐添加完成：' + song.name,
            attachments: [{
              title: song.name,
              url: urlMatched[0],
              photoUrl: (song.singer ? song.singer + ' - ' : '') + song.image,
              description: song.orderer
            }],
            create: true
          }
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
