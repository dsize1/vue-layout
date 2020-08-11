const openDb = require('../../db/openDb');

const queryStocksInfo = async (search, verbose) => {
  const db = await openDb('stocks', verbose)
  // todo sql select
  const data = await db.get('SELECT ')
  await db.close();
  return data;
};

module.exports = queryStocksInfo;
