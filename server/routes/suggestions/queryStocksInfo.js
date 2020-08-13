const openDb = require('../../db/openDb');

/**
 * @description: 模糊查询 
 * @param {object} 查询参数
 * @param {boolean} 测试标志 
 * @return {type} 
 */
const queryStocksInfo = async ({ search, currPage, pageSize }, verbose) => {
  const db = await openDb('stocks', verbose)
  const { total } = await db.get(`
    SELECT COUNT(*) AS total
    FROM markets
    WHERE code LIKE '%${search}%' OR name LIKE '%${search}%'
  `);
  const totalPage = Math.ceil(total / pageSize);
  if (currPage > totalPage) {
    await db.close();
    return { data: [], totalPage, total }
  }
  const data = await db.all(`
    SELECT code, name
    FROM markets 
    WHERE code LIKE '%${search}%' OR name LIKE '%${search}%'
    Limit ${pageSize} OFFSET ${(currPage - 1) * pageSize}
  `);
  await db.close();
  return { data, totalPage, total };
};

module.exports = queryStocksInfo;
