'use strict'

const playlist = require('../models/playlist')
const Player = require('../models/player')

setInterval(() => console.info(`There's ${playlist.count()} song(s) reserved`), 5 * 1000)

module.exports = new Player(playlist)
