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
    if (!id) {
      return `不支持的分享地址：${url}}`
    }
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
      if (result&& result.data && result.status === 200) {
        return result.data.toString()
      }
      else {
        return `不支持的分享地址：${url}}`
      }
    }
    catch (err) {
      return err
    }
  }
}


module.exports = new WYMusic()