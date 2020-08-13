const classOf = require('./classOf');

/**
 * @description: 判断是否原始类型 
 * @param {any} 
 * @return {boolean} 
 */
const isPrmitive = (o) => ['Number', 'String', 'Symbol', 'Boolean', 'Null', 'Undefined'].includes(classOf(o));

module.exports = isPrmitive;
