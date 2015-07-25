/**
 * Created by trigged on 7/25/15.
 */

class BaseMusic {

  static SupportError() {
    throw Error(`不支持的分享地址`)
  }

  match(url) {
    throw new Error.BSS("Don't call this function not Implementation");
  }

  musicApi(path, query) {
    throw new Error.BSS("Don't call this function not Implementation");
  }

  * analysis(url) {
    throw new Error.BSS("Don't call this function not Implementation");
  }
}

module.exports = BaseMusic