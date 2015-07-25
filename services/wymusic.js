/**
 * Created by trigged on 7/25/15.
 */
"use strict"
const urllib = require("urllib")
  , Url = require("url")

//03 17
class WYMusic {

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
    if (id) {
      try {
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
        if (result[0] && result[1] && result[1].status === 200) {
          return result
        }
      }
      catch (err) {
        return err
      }
    }
    return `不支持的分享地址：${url}}`

  }
}


module.exports = new WYMusic()