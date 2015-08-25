/**
 * Created by trigged on 7/25/15.
 */
"use strict"

require('node-extensions')
require('babel/register')


const koa = require('koa')
  , app = koa()
  , body = require('koa-body')()
  , router = require('koa-router')()
  , music = require("./api/music")
  , hook = require("./api/hook")

app.use(function *(next) {
  var start = new Date();
  yield next;
  var ms = new Date() - start;
  this.set('X-Response-Time', ms + 'ms');
});


// logger

app.use(function *(next) {
  var start = new Date();
  yield next;
  var ms = new Date() - start;
  console.log('%s %s - %s', this.method, this.url, ms);
});

app.use(function* (next) {
  try {
    yield next
  } catch (e) {
    this.body = {
      code: 1,
      error_desc: e instanceof Error ? e.message : e,
      data: {}
    }
    console.error(e.stack)
    return
  }

  if (this.data) {
    this.body = {
      code: 0,
      data: this.data || {}
    }
  }

  yield next
})

app.use(router.routes());
app.use(router.allowedMethods());

router.get('/songs', music.list);
router.post('/songs', body, music.add);
router.delete('/songs', music.remove);

router.post('/hook_receive', body, hook.receive);

router.all('/', function* () {
  this.body = 'Powered by PUBU.IM(c)'
})

app.listen(process.env.PORT || 3000);
