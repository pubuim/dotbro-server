/**
 * Created by trigged on 7/25/15.
 */

const WYMusic = require("./wymusic")
  , BaseMusic = require("./wymusic")

const hanlders = [WYMusic]

function *getHnadler(url) {
  let hand
  hanlders.forEach(function (handler) {
    if (handler.match(url)) {
      hand = handler
      return
    }
  })
  if (hand) {
    return yield hand.analysis(url)
  } else {
    throw BaseMusic.SupportError();
  }
}
module.exports = getHnadler;