/**
 * @description: 获取参数数据类型
 * @param {any} 
 * @return {string} 
 */
const classOf = (o) => Object.prototype.toString.call(o).slice(8, -1)

module.exports = classOf;
