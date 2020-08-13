const R = require('ramda');

/**
 * @description: 获取对象值，并提供默认值
 * @param {array} 路径
 * @param {array} 键
 * @param {array} 默认值 
 * @return {array} 
 */
const getValuesWithDefault = (path, keys, defaultValue) => R.pipe(
  R.path(path),
  R.props(keys),
  R.addIndex(R.map)((value, index) => R.defaultTo(defaultValue[index], value))
);

module.exports = getValuesWithDefault;
