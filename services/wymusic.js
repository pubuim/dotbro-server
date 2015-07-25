/**
 * Created by trigged on 7/25/15.
 */
"use strict"
const urllib = require("urllib")
  , Url = require("url")
  , BaseMusic = require("./music")

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

  * analysis(url) {
    let id = url.split("id=")[1]
    if (!id) {
      BaseMusic.SupportError();
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
      return result.data.toString()
    }
    else {
      BaseMusic.SupportError();
    }
  }
}


module.exports = new WYMusic()