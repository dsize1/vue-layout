const R = require('ramda');

const fixedNumber = require('../../utils/fixedNumber');

/**
 * @description: 分组判断
 * @param {string} 频度 
 * @return {function} 
 */
const judgeSameGroup = (freq) => (a, b) => {
  const dateA = new Date(a.datetime);
  const dateB = new Date(b.datetime);
  const monthA = dateA.getMonth();
  const monthB = dateB.getMonth();
  const yearA = dateA.getFullYear();
  const yearB = dateB.getFullYear();
  return (freq === 'annual' || monthA === monthB) && yearA === yearB; 
};

/**
 * @description: 获取最高价，最低价及成交量汇总的reducer
 * @param {object}
 * @param {object} 
 * @return {object} 
 */
const formatReducer = (acc, item) => {
  acc.high = R.max(acc.high, item.high);
  acc.low = R.min(acc.low, item.low);
  acc.volume = acc.volume + item.volume;
  return acc;
} 

/**
 * @description: 格式化分组 
 * @param {array} 分组数据 
 * @return {object} 
 *  open：启期开盘价
 *  code：券代码、交易所标识大写
 *  datetime:  启期
 *  close：止期收盘价
 *  high：分组最高价
 *  low: 分组最低价
 *  volume：分组成交量汇总
 */
const formatter = (group) => {
  const { open, symbol, datetime } = R.head(group);
  const { close } = R.last(group);
  const { high, low, volume } = R.reduce(
    formatReducer,
    { high: -Infinity, low: Infinity, volume: 0 },
    group
  );
  return { 
    open,
    code: R.toUpper(symbol),
    datetime,
    close,
    high,
    low,
    volume: fixedNumber(volume, 'Number', { decimals: 4 })
  };
};

/**
 * @description: 依频率分组格式化数据（原数据频度为交易日）
 * @param {array} 原始数据
 *  close：收盘价
 *  open：开盘价
 *  symbol: 券代码
 *  datetime：日期
 *  high：最高价
 *  low：最低价
 *  volume：成交量
 * @param {string} 频度 ['daily', 'monthly', 'annual']
 * @return {array} 
 */
const formatByGroup = (data, freq) => {
  if (freq === 'daily') {
    return data;
  }
  return R.pipe( 
    R.groupWith(judgeSameGroup(freq)),
    R.map(formatter),
  )(data);
};

module.exports = formatByGroup;
