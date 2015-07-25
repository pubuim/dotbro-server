/**
 * Created by trigged on 7/25/15.
 */
"use strict"

require('node-extensions')
require('babel/register')

const mdns = require('./libs/mdns')

const koa = require('koa')
  , app = koa()
  , bodyParser = require('koa-body-parser')
  , _ = require('koa-route')
  , music = require("./api/music")

app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  this.set('X-Response-Time', ms + 'ms');
});


// logger

app.use(function *(next) {
  var start = new Date;
  yield next;
  var ms = new Date - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});
app.use(bodyParser());

app.use(function* (next) {
  try {
    yield next
  } catch (e) {
    this.body = {
      code: 1,
      error_desc: e instanceof Error ? e.message : e,
      data: {}
    }
    return
  }
  this.body = {
    code: 0,
    data: this.data || {}
  }
})

app.use(_.get('/track_list', music.list));
app.use(_.get('/order', music.add));
app.use(_.delete('/delete', music.remove));

app.listen(3000);
mdns();
