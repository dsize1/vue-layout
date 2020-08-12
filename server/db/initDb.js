const R = require('ramda');

const openDb = require('./openDb');
const { get$ } = require('../utils/request');
const print = require('../utils/print');

const marketsTableName = 'markets';
/**
 * @description: 创建a股市场表
 * @param {object} 数据库实例  
 * @param {array} 市场数据
 * @return {promise} 
 */
const createMarketsTable = async (db, data) => {
  const createResult = await db.run(
    'CREATE TABLE markets (code TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL)');
  print('create markets table', { result: createResult });
  const statement = await db.prepare('INSERT INTO markets VALUES ($code, $name)');
  for (const item of data) {
    await statement.bind({ $code: item.code, $name: item.name });
    await statement.get();
  }
};

/**
 * @description: 初始化数据库
 * @param {boolean} 测试标志位
 * @param {string}  
 * @return {promise} 
 */
const initDb = async (verbose, apikey) => {
  try {
    const stocksDb = await openDb('stocks', verbose);
    const initialized = await stocksDb.get('SELECT count(*) FROM sqlite_master WHERE type = $type AND name = $tablename', {
      $type: 'table',
      $tablename: marketsTableName
    });
    if (initialized['count(*)'] === 0) {
      const url = 'https://api.trochil.cn/v1/cnstock/markets';
      const query = { apikey };
      const [err, data] = await get$(url, { query }).toPromise();
      if (!R.isEmpty(data) && !err) {
        const formatted = R.map(({ symbol, name, exchange }) => ({ code: symbol, name, exchange }), data);
        // 逐条插入性能太差，需要使用事务来完成导入。
        await createMarketsTable(stocksDb, formatted);
      }
    }
    await stocksDb.close();
  } catch (err) {
    print('open db error', err);
  }
}

module.exports = initDb;
