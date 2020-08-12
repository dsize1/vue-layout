const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('@koa/router');
const bodyParser = require('koa-bodyparser');

// log 中间件
const logger = require('./middleware/logger');

// 路由中间件
const testRoute = require('./routes/test/');
const suggestionsRoute = require('./routes/suggestions/')
const candlestickRoute = require('./routes/candlestick/');
const realtimeRoute = require('./routes/realtime/');


// 初始化数据库
const initDb = require('./db/initDb');

// 端口
const port = 8989;

// 测试标志位
const testSign = false;
const apikey = 'f6a7d09ad27d2fe2afdb15dc76b15076';

const app = new Koa();
const router = new Router();

// 绑定路由函数
const useRouter = require('./utils/useRouter')(router);

//注册路由
useRouter(testRoute);
useRouter(suggestionsRoute);
useRouter(candlestickRoute);
// useRouter(realtimeRoute);


// 主函数
const main = async () => {
  await initDb(testSign, apikey);
  app.context.verbose = testSign;
  app.context.apikey = apikey;

  app
  .use(cors())
  .use(bodyParser())
  .use(logger())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port);

  console.log('listening port:', port);
};

main();


