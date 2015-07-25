'use strict'

const list = new Map()
var order = []

module.exports = {
  add: function (song) {
    list.set(song.id, song)
    order.push(song.id)
  },

  get: function () {
    list.get(order.first)
  },

  shift: function () {
    let id = order.shift()
    if (!id) { return null }

    let song = list.get(id)
    list.delete(id)

    return song
  },

  count: function () {
    return order.length
  },

  remove: function (id) {
    let ids = [].concat(id)

    ids.forEach(function (id) {
      list.delete(id)
    })

    let originalLength = order.length

    order = order.filter(function (id) {
      return !ids.find(id) && list.get(id).playing
    })

    return originalLength - order.length
  },

  values: function (id, count) {
    var start;
    if (!id) {
      start = 0;
    }
    else {
      start = order.findIndex(id)
      if (start === -1) {
        return []
      }
    }

    var result = []
    count = Math.floor(count) || 20
    for (; count; start++, count--) {
      result.push(list.get(order[start]))
    }
    return result.compact()

  }
}
