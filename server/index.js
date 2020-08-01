const Koa = require('koa');
const cors = require('@koa/cors');
const Router = require('@koa/router');

const port = 8989;

const app = new Koa();

const router = new Router();

const oneDay = 1000 * 60 * 60 * 24;

router.get('/api/load', async (ctx, next) => {
  try {
    const query = ctx.request.query;
    console.log(query);
    const { start, end } = query;
    const startDate = new Date(start);
    const endDate = new Date(end);
    if ( endDate - startDate < oneDay * 10 ) {
      ctx.status = 500;
    } else {
      const dayN = (endDate - startDate) / oneDay;
      const tableData = new Array(dayN).fill(0).map((_, index) => ({
        name: `name_${index}`,
        address: `address_${index}`,
        time: `time_${index}`
      }))
      const columnDim = [
        { title: 'name', align: 'center', style: { color: 'blue', fontWeight: 'bold' } },
        { title: 'address', align: 'right' },
        { title: 'time', align: 'left' }
      ]
      const body = JSON.stringify({ status: 'ok', data: { data: tableData, columnDim } });
      ctx.body = body; 
    }
  } catch(e) {
    ctx.status = 500;
  }
  await next();
});

app
  .use(cors())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(port);


