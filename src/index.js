const debug = require('debug');
debug.enable('chime:*');
const log = debug('chime:index');

const Koa          = require('koa');
const logger       = require('koa-logger');
const responseTime = require('koa-response-time');
const compress     = require('koa-compress');
const serve_static = require('koa-static');
const bodyparser   = require('koa-bodyparser');
const Router       = require('koa-router');

const { join } = require('path');

const load = require('./lib/load');

// env
const env = process.env.NODE_ENV || 'development';

// init
const app    = new Koa();
const router = new Router();

// logging
if ('test' !== env) app.use(logger());

// x-response-time
app.use(responseTime());

// compression
app.use(compress());

// body parser
app.use(bodyparser({enableTypes: ['json']}));

// boot
load(app, router, __dirname + '/api');

// routing
app.use(router.routes());
app.use(router.allowedMethods());

// static
app.use(serve_static(join(__dirname + './../public')));

// start
app.listen(3000, () =>
  log('Listening on 3000')
);
