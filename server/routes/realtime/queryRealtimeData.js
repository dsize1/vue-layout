const R = require('ramda');

const openDb = require('../../db/openDb');
const { get$ } = require('../../utils/request');
const fixedNumber = require('../../utils/fixedNumber');
const print = require('../../utils/print');

const getRandomPercent = (rowPercent) => {
  const sign = rowPercent > 0 ? 1 : -1;
  const abs = Math.abs(rowPercent);
  const isIncrease = Math.random() > 0.5 ? 1 : -1;
  const factor = Math.random();
  const percent = factor * isIncrease * abs + abs;  
  return fixedNumber(sign * percent, 'Number');
};

const getClose = async (url, params) => {
  const [err, data] = await get$(url, { query: params }).toPromise();
  if (!R.isEmpty(data) && !err) {
    return data.close;
  } else {
    throw Error('get yesterdays closing price failed')
  }
};

const queryIndexDb = async ({ start, end, verbose }) => {
  try {
    print('query index db', { start, end });
    const db = await openDb('stocks', verbose);
    const data = await db.all(`
      SELECT percent_change
      FROM cn_stocks_index
      WHERE code = '000001' AND timestamp BETWEEN ${start} AND ${end}
      ORDER BY timestamp;
    `);
    await db.close();
    return data;
  } catch(e) {
    print('query index db failed', e);
  }
};

const genRealtimeData = (code, price, indexData) => {
  const reduced = R.reduce((acc, item) => {
    { last, percent_change}
    const percent_change = getRandomPercent(item.percent_change);
    const last = (1 + (percent_change) / 100) * acc.open;
    const change = last - acc.open;
    acc.open = last;
    acc.data.push({
      code,
      last: fixedNumber(last, 'Number'),
      change: fixedNumber(change, 'Number'),
      percent_change: fixedNumber(percent_change, 'Number'),
      time: item.time,
      timestamp: item.timestamp,
      datetime: item.datetime,
    });
    const fixedLast = fixedNumber(last, 'Number');
    acc.high = R.max(fixedLast, acc.high);
    acc.low = R.min(fixedLast, acc.low);
    return acc;
  }, { data: [], high: -Infinity, low: Infinity, open: price }, indexData);
  return R.pick(['data', 'high', 'low'], reduced);
};

const queryRealtimeData = async (getUrl, getParams, queryIndexDbParams) => {
  const [close, indexData] = await Promise.all([
    getClose(getUrl, getParams),
    queryIndexDb(queryIndexDbParams)
  ]);
  const data = genRealtimeData(getParams.symbol, close, indexData);
  return data;
};

module.exports = queryRealtimeData;