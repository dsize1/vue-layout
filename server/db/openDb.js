const path = require('path');
const { open } = require('sqlite');

const getDbPath = (dbName) => path.join(__dirname, `./${dbName}.db`);

const openDb = async (dbName, verbose) => {
  const dbPath = getDbPath(dbName);
  const db = await open(dbPath, { verbose });
  return db;
};

module.exports = openDb;
