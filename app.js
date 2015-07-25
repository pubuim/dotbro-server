/**
 * Created by trigged on 7/25/15.
 */
"use strict"

require('node-extensions')
require('babel/register')

const koa = require('koa')
  , app = koa()
  , bodyParser = require('koa-body-parser')
  , _ = require('koa-route')
  , music = require("./api/music")
  , hook = require("./api/hook")

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
app.use(_.get('/music', music.list));
app.use(_.post('/music', music.add));
app.use(_.post('/hook_receive', hook.receive));
app.use(_.delete('/music/:id', music.remove));

app.listen(3000);
