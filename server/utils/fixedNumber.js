const R = require('ramda');

const classOf = require('./classOf');

/**
 * @description: 添加千分位
 * @param {number | string} 
 * @param {string} 分隔符
 * @return {string} 
 */
const toCurrency = (num, symbol = ',') => {
  const sign = Number(num) >= 0 ? '' : '-';
  const abs = Number(num) >= 0 ? String(num) : String(num).slice(1);
  const string = `${abs}`.split('.');
  const partInt = (string[0] || '0').split('');
  const partFloat = string[1];
  const formatted = partInt.reverse().reduce((res, item, index) => `${item}${(index > 0 && index % 3 === 0) ? symbol : ''}${res}`, '');
  return R.isNil(partFloat) ? `${sign}${formatted}` : `${sing}${formatted}.${partFloat}`;
}

/**
 * @description: 格式化number 
 * @param {number}
 * @param {string} percent类型默认放大100倍['Number', 'Percent']
 * @param {object} 配置 
 *  isNilValue: 自定义空值判断函数
 *  nilVale: 空值展示的字符，默认‘--’
 *  times: 放大倍数
 *  decimals：保留小数位数
 *  separator： 是否需要千分位展示
 *  separatorSymbol: 自定义千分位符
 *  prefix: 前缀
 *  suffix: 后缀               
 * @return {type} 
 */
const fixedNumber = (number, dataType = 'Number', options = null) => {
  const isNilValue = R.prop(options, 'isNilValue');

  if (
    number === '' ||
    R.isNil(number) ||
    Number.isNaN(number) ||
    (classOf(isNilValue) === 'function' && isNilValue(number, dataType))
  ) {
    return R.defaultTo('--')(R.prop(options, 'nilValue'));
  }
  const defaultTimes = dataType === 'Percent' ? 100 : 1;
  const times = R.defaultTo(defaultTimes)(R.prop(options, 'times'));
  const decimals = R.defaultTo(2)(R.prop(options, 'decimals'));
  const separator = R.defaultTo(false)(R.prop(options, 'separator'));
  const separatorSymbol = R.defaultTo(',')(R.prop(options, 'separatorSymbol'))
  const prefix = R.defaultTo('')(R.prop(options, 'prefix'));
  const suffix = R.defaultTo('')(R.prop(options, 'suffix'));
  const num = number * times;
  const fixedNum = num.toFixed(decimals);
  return `${prefix}${separator ? toCurrency(fixedNum, separatorSymbol) : fixedNum}${suffix}`;
};

module.exports = fixedNumber;
