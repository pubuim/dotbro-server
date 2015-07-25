/**
 * Created by trigged on 7/25/15.
 */

const WYMusic = require("./wymusic")
  , BaseMusic = require("./wymusic")

const hanlders = [WYMusic]

function *getHnadler(url) {

  let hand = hanlders.find(function (handler) {
    return handler.match(url)
  })
  if (hand) {
    return yield hand.analysis(url)
  } else {
    throw BaseMusic.SupportError();
  }
}
module.exports = getHnadler;