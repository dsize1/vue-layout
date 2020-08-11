const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

const logger = require('./middleware/logger');

const testRoute = require('./routes/test/');
const suggestionsRoute = require('./routes/suggestions/')
const candlestickRoute = require('./routes/candlestick/');
const realtimeRoute = require('./routes/realtime/');

const initDb = require('./db/initDb');

const port = 8989;

const testSign = false;

const app = new Koa();
const router = new Router();

const useRouter = require('./utils/useRouter')(router);

useRouter(testRoute);
useRouter(suggestionsRoute);
// useRouter(candlestickRoute);
// useRouter(realtimeRoute);

const main = async () => {
  await initDb(testSign);
  app.context.verbose = testSign;

  app
  .use(cors())
  .use(bodyParser())
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port);

  console.log('listening post:', port);
};

main();


