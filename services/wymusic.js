/**
 * Created by trigged on 7/25/15.
 */
"use strict"
const urllib = require("urllib")
  , Url = require("url")
  , BaseMusic = require("./music")
  , Song = require("../models/song")

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
        resourceUrl: song.mp3Url,
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
        resourceUrl: song.mp3Url,
        orderer: orderer
      })
    }

    return null
  }
}


module.exports = new WYMusic()
