'use strict'

var mdns = require('mdns')

var ad = mdns.createAdvertisement(mdns.tcp('http'), 4321)

module.exports = function () {
  ad.start()
}
