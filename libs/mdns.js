'use strict'

var mdns = require('mdns')

module.exports = function (app) {
  app.on('listening', function () {
    mdns.createAdvertisement(mdns.tcp('http'), app.address().port).start();
  });
}
