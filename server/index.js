require('es6-promise').polyfill();
require('isomorphic-fetch');

const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const logger = require('./middleware/logger');

const testRoute = require('./routes/test/');
const candlestickRoute = require('./routes/candlestick/');
const realtimeRoute = require('./routes/realtime/');

const port = 8989;
const app = new Koa();
const router = new Router();
const useRouter = require('./utils/useRouter')(router);

useRouter(testRoute);
useRouter(candlestickRoute);
// useRouter(realtimeRoute);

app
  .use(cors())
  .use(bodyParser())
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port);

console.log('listening post:', port);
