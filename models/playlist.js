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

  remove: function (id) {
    let ids = [].concat(id)

    ids.forEach(function (id) {
      list.delete(id)
    })

    order = order.filter(function (id) {
      return !ids.find(id)
    })
  },

  values: function (id, count) {
    var start = order.findIndex(id)

    if (start === -1) {
      return []
    }

    var result = []
    count = Number.isNumber(count) && count > 0 ? count : 20

    for (; count; start++, count--) {
      result.push(list.get(order[start]))
    }

    return result
  }
}
