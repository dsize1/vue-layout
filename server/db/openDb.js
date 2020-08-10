const path = require('path');
const { open } = require('sqlite');

const getMarkets = require('../utils/api/getMarkets');

const stocksFileName = path.join(__dirname, './stocks.db');

const stocksCodeName = 'stocksCode';
const createStocksCodeTable = async (db) => {
  db.run(
    "CREATE TABLE $name (code TEXT PRIMARY KEY NOT NULL, name TEXT NOT NULL)",
    { name: stocksCodeName }
  );

};

const openDb = async (verbose) => {
  try {
    const stocksDb = await open(stocksFileName, { verbose });
    const initialized = await stocksDb.get('SELECT count(*) FROM sqlite_master WHERE type = $type AND name = $name', {
      $type: 'table',
      $name: stocksCodeName
    });
    if (initialized['count(*)'] === 0) {
      const markets = await getMarkets();
      console.log(markets);
      await createStocksCodeTable(stocksDb);
    }
    return stocksDb;
  } catch (err) {
    console.log('--------------------------------');
    console.log('--open error:', err.message);
    console.log('---------------------------------');
  }
}

module.exports = openDb;
