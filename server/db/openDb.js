const path = require('path');
const { open } = require('sqlite');

/**
 * @description: 获取数据库文件绝对路径
 * @param {string} 数据库名称
 * @return {string} 
 */
const getDbPath = (dbName) => path.join(__dirname, `./${dbName}.db`);

/**
 * @description: 打开链接数据库 
 * @param {string} 数据库名称
 * @param {boolean} 测试标志位
 * @return {object} 数据库实例 
 */
const openDb = async (dbName, verbose) => {
  const dbPath = getDbPath(dbName);
  const db = await open(dbPath, { verbose });
  return db;
};

module.exports = openDb;
