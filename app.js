/**
 * Created by trigged on 7/25/15.
 */
"use strict"
const koa = require('koa')
  , app = koa()
  , _ = require('koa-route')
  ,music = require("./api/music")

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

app.use(_.get('/music', music));

app.use(function *() {
  this.body = 'Hello World';
});

app.listen(3000);