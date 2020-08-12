const R = require('ramda');

const formatByGroup = require('./formatByGroup');
const getRequestQuery = require('../../utils/getValuesWithDefault');
const { get$ } = require('../../utils/request');

const QUERY_PATH = ['request', 'query'];
const QUERY_KEYS = ['code', 'start', 'end', 'frequency'];
const QUERY_DEFAULT = ['', undefined, undefined, 'daily'];

const candlestick = async (ctx, next) => {
  const [code, start, end, freq] = getRequestQuery(QUERY_PATH, QUERY_KEYS, QUERY_DEFAULT)(ctx);
  if (code === '') {
    ctx.body = { code: 0, data: [] };
  } else {
    const url = 'https://api.trochil.cn/v1/cnstock/history';
    const query = R.pickBy(
      (val) => !R.isNil(val),
      {
        symbol: code,
        start_date: start,
        end_date: end,
        freq: 'daily',
        apikey: ctx.apikey
      }
    );
    const [err, rawData] = await get$(url, { query }).toPromise();
    if (!R.isEmpty(rawData) && !err) {
      const data = formatByGroup(rawData, freq);
      ctx.body = { code: 1, data };
    } else {
      throw Error('fetch history data failed')
    }
  }
  await next();
};

module.exports = {
  method: 'get',
  url: '/api/candlestick',
  middleware: candlestick
};
