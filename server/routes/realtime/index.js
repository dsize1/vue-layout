const moment = require('moment');

const queryRealtimeData = require('./queryRealtimeData');
const getRequestQuery = require('../../utils/getValuesWithDefault');

const QUERY_PATH = ['request', 'query'];
const QUERY_KEYS = ['code', 'start', 'end'];
const QUERY_DEFAULT = [''];

const realtime = async (ctx, next) => {
  const now = moment().utcOffset(8);
  const startDefault = moment(now).set({ hour: 9, minute: 30 }).format(x);
  const endDefault = moment(now).format(x);
  const queryDefault = [...QUERY_DEFAULT, startDefault, endDefault];
  const [code, start, end] = getRequestQuery(QUERY_PATH, QUERY_KEYS, queryDefault)(ctx);
  if (code === '') {
    ctx.body = { code: 0, data: [] };
  } else {
    //昨天并不一定是T-1交易日
    const lastDay = moment(now).subtract(1, 'day').format('YYYY-MM-DD');
    const getClosePriceUrl = 'https://api.trochil.cn/v1/cnstock/history_one_day';
    const getClosePriceParams = {
      symbol: code,
      date: lastDay,
      apikey: ctx.apikey
    };
    const queryIndexDbParams = { start, end, verbose: ctx.verbose };
    const data = await queryRealtimeData(getClosePriceUrl, getClosePriceParams, queryIndexDbParams);
    ctx.body = { code: 1, data };
  }
  await next();
};

module.exports = {
  method: 'get',
  url: '/api/realtime',
  middleware: realtime
};
