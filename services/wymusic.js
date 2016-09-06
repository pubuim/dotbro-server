/**
 * Created by trigged on 7/25/15.
 */
"use strict"
const urllib = require("urllib")
  , Url = require("url")
  , BaseMusic = require("./music")
  , Song = require("../models/song")

const encoder = require('../libs/wymusic-url-params-encoder')

function* genRealUrl (dummyUrl, id) {
  if ((yield urllib.request(dummyUrl, {
    method: 'HEAD',
    headers: { Referer: "http://music.163.com/" }
  })).status < 400) return dummyUrl

  const data = { csrf_token: "", br: 128000, ids: [String(id)] }
  const body = encoder.asrsea(
    JSON.stringify(data),
    '010001',
    '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7',
    '0CoJUm6Qyw8W8jud'
  )
  const resp = yield urllib.request('http://music.163.com/weapi/song/enhance/player/url', {
    method: 'POST',
    headers: { Referer: "http://music.163.com/" },
    data: { params: body.encText, encSecKey: body.encSecKey }
  })
  return JSON.parse(resp.data.toString()).data[0].url
}


//03 17
class WYMusic extends BaseMusic {

  match(url) {
    return /music.163.com/.test(url)
  }

  musicApi(path, query) {
    return Url.format({
      protocol: "http",
      host: "music.163.com",
      pathname: path,
      query: query
    })
  }

  * analysis(url, orderer) {
    let id = url.split("id=")[1]
    if (!id) {
      ///http://music.163.com/#/song/4280207/
      id = url.match(/song\/(\d+)/)
      if (!id) {
        BaseMusic.SupportError();
      }
      id = id[1]
    }
    let result = yield urllib.request(this.musicApi("api/song/detail", {
        id: id,
        ids: `[${id}]`
      }),
      {
        headers: {
          Referer: "http://music.163.com/",
          Cookie: "appver=1.5.0.75771"
        }
      })
    if (result && result.data && result.status === 200) {
      let data = JSON.parse(result.data.toString())
      // console.log("resu",data);
      let song = data.songs[0]
      if (!song) {
        return BaseMusic.SupportError();
      }

      return new Song({
        name: song.name,
        album: song.album.name,
        artists: song.artists.map(a => a.name),
        image: song.album.picUrl,
        resourceUrl: yield genRealUrl(song.mp3Url, id),
        orderer: orderer
      })
    }
    else {
      BaseMusic.SupportError();
    }
  }

  * search(kw, orderer) {
    let result = yield urllib.request(this.musicApi("api/search/get"),
      {
        method: "POST",
        data: {
          s: kw,
          type: 1,
          limit: 10,
          offset: 0
        },
        headers: {
          Referer: "http://music.163.com/",
          Cookie: "appver=1.5.0.75771"
        }
      })

    if (result && result.data && result.status === 200) {
      let data = JSON.parse(result.data.toString())

      return data.result.songs.map(song => new Song({
        id: song.id,
        name: song.name,
        album: song.album.name,
        artists: song.artists.map(a => a.name),
        image: song.album.picUrl,
        resourceUrl: song.mp3Url,
        orderer: orderer
      }))
    }

    return []
  }

  * get(id, orderer) {
    let result = yield urllib.request(this.musicApi(`api/song/detail`, {id: id, ids: `[${id}]`}),
      {
        headers: {
          Referer: "http://music.163.com/",
          Cookie: "appver=1.5.0.75771"
        }
      })

    if (result && result.data && result.status === 200) {
      let data = JSON.parse(result.data.toString())

      let song = data.songs[0]
      if (!song) {
        return BaseMusic.SupportError();
      }

      return new Song({
        id: song.id,
        name: song.name,
        artists: song.artists.map(a => a.name),
        album: song.album.name,
        image: song.album.picUrl,
        resourceUrl: yield genRealUrl(song.mp3Url, id),
        orderer: orderer
      })
    }

    return null
  }
}


module.exports = new WYMusic()
