'use strict'

const list = new Map()
var order = []

module.exports = {
  add: function (song) {
    list.set(song.id, song)
    order.push(song.id)
  },

  get: function () {
    return list.get(order.first)
  },

  count: function () {
    return order.length
  },

  next: function () {
    return order.length
  },

  remove: function (id, force) {
    let ids = [].concat(id)
    let removed = []

    ids.forEach(function (id) {
      let index = order.indexOf(id)
      if (index === -1) {
        console.warn(`Song: ${id} not found in playlist`)
        return
      }

      let song = list.get(id)
      if (!force && song.playing) {
        console.warn(`Song: ${id} not found in playlist`)
        return
      }

      removed.push(song)

      order.splice(index, 1)
      list.delete(id)
    })

    return removed
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
