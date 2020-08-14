const moment = require('moment');
const { interval } = require('rxjs');
const { mergeMap, concatMap, tap } = require('rxjs/operators');
const R = require('ramda');

const { get$ } = require('../utils/request');
const print = require('../utils/print');
const openDb = require('./openDb');

/**
 * @description: 上午交易开始时间
 * @param {moment} 
 * @return {moment} 
 */
const startTradingHoursAM = (now) => moment(now).set({ hour: 9, minute: 15 });

/**
 * @description: 上午交易结束时间
 * @param {moment} 
 * @return {moment} 
 */
const endTradingHoursAM = (now) => moment(now).set({ hour: 11, minute: 30 });

/**
 * @description: 下午交易开始时间
 * @param {moment} 
 * @return {moment} 
 */
const startTradingHoursPM = (now) => moment(now).set({ hour: 12, minute: 45 });

/**
 * @description: 下午交易结束时间
 * @param {moment} 
 * @return {moment} 
 */
const endTradingHoursPM = (now) => moment(now).set({ hour: 15, minute: 0 });

/**
 * @description: 午间收盘开始时间
 * @param {moment} 
 * @return {moment} 
 */
const startIntermission = (now) => moment(now).set({ hour: 11, minute: 30 });

/**
 * @description: 午间收盘结束时间
 * @param {moment} 
 * @return {moment} 
 */
const endIntermisssion = (now) => moment(now).set({ hour: 12, minute: 45 });


/**
 * @description: 判断交易时间
 * @param {moment} 
 * @return {boolean} 
 */
const isTradingHours = (now) => {
  const startAM = startTradingHoursAM(now);
  const endAm = endTradingHoursAM(now);
  const startPM = startTradingHoursPM(now);
  const endPM = endTradingHoursPM(now);
  return moment(now).isBetween(startAM, endAm, 'minute', '(]') ||
  moment(now).isBetween(startPM, endPM, 'minute', '(]')
};


/**
 * @description: 获取定时启动时间
 * @param {moment} 
 * @return {number} 
 */
const getDelay = (now) => {
  const startIM = startIntermission(now);
  const endIM = endIntermisssion(now);
  if (moment(now).isBetween(startIM, endIM, 'minute', '(]')) {
    return startTradingHoursPM(now).diff(now);
  }

  const startAM = startTradingHoursAM(now);
  if (moment(now).isBefore(startAM, 'minute')) {
    return startAM.diff(now);
  }

  const tomorrow = moment(now).add(1, 'days');
  return startTradingHoursAM(tomorrow).diff(now);
};

/**
 * @description: 清空股指表数据，次日8点定时启动
 * @param {boolean}  
 */
const deleteIndexDb = async (verbose) => {
  try {
    print('delete IndexDb');
    const db = await openDb('stocks', verbose);
    //只删除T-(7+)的数据
    const last7Day = moment().utcOffset(8).subtract(7, 'day').format('x');
    await db.run(`DELETE FROM cn_stocks_index WHERE timestamp < ${last7Day}`);
    await db.close();
    print('delete IndexDb success');
  } catch(e) {
    print('delete IndexDb error', e);
  }
}

/**
 * @description: 更新表数据
 * @param {boolean}
 * @param {array} 实时数据 
 */
const updateIndexDb = async (verbose, data) => {
  try {
    print('update indexDb', { data });
    const db = await openDb('stocks', verbose);
    const mapIndexed = R.addIndex(R.map);
    const params = mapIndexed((stocksIndex) => {
      return R.reduce((acc, [key, val]) => {
        acc[`$${key}`] = val;
        return acc;
      }, {}, R.toPairs(stocksIndex));
    }, data);
    const statement = await db.prepare(`
      INSERT INTO cn_stocks_index (country,name,last,high,low,change,percent_change,time,timestamp,datetime,code,symbol)
      VALUES ($country,$name,$last,$high,$low,$change,$percent_change,$time,$timestamp,$datetime,$code,$symbol)
    `);
    for(const item of params) {
      console.log(item);
      await statement.bind(item);
      await statement.get();
    }
    await statement.finalize();
    await db.close();
    print('update indexDb success');
  } catch(e) {
    print('update IndexDb error', e);
  }
};

const cnStocksIndexList = [{ name: '上证指数', code: '000001' }, { name: '深证成指', code: '399001' }];

/**
 * @description: 轮询数据源更新数据
 * @param {boolean} 
 * @param {string} 
 */
const updateCnstocksIndexDb = (verbose, apikey) => {
  const oneMinute = 60 * 1000;
  const url = 'https://api.trochil.cn/v1/index/tickers';
  interval(oneMinute)
  .pipe(
    mergeMap(() => {
      return get$(url, { query: { apikey } });
    }),
  )
  .subscribe(([err, resp]) => {
    const now = moment().utcOffset(8);
    if (!isTradingHours(now)) {
      print('exceed trading hours', { now });
      updateCnStocksIndex(verbose, apikey);
      if (moment(now).isAfter(endTradingHoursPM(now), 'minute')) {
        const tomorrow8AM = moment(now).add(1, 'days').set({ hour: 8, minute: 0 });
        const delay = tomorrow8AM.diff(now);
        print('delete index db', { now, delay });
        setTimeout(() => deleteIndexDb(verbose), delay);
      }
    } else {
      const cnStocksIndex = R.reduce((acc, stocksIndex) => {
        if (acc.length >= 2) {
          return acc;
        }
        const { code } = R.find(R.propEq('name', stocksIndex.name))(cnStocksIndexList);
        if (code) {
          acc.push({ 
            ...stocksIndex,
            code,
            time: moment(now).subtract(1, 'seconds').format()
          });
        }
        return acc;
      }, [], resp);
      updateIndexDb(verbose, cnStocksIndex);
    }
  });
};

/**
 * @description: 判断当前是否是交易时间，若不是交易时间计算出定时启动时间，并延迟启动。
 * @param {type} 
 * @param {string}
 * @param {boolean} 跳过判断
 */
const updateCnStocksIndex = (verbose, apikey, notJudge = false) => {
  const now = moment().utcOffset(8);

  if (notJudge || isTradingHours(now)) {
    print('is tranding hours', { now });
    updateCnstocksIndexDb(verbose, apikey);
  } else {
    const delay = getDelay(now);
    print('isnt tranding hours', { now, delay });
    setTimeout(() => updateCnStocksIndex(verbose, apikey, true), delay);
  }
};

module.exports = updateCnStocksIndex;
