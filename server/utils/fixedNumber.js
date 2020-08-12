const R = require('ramda');

const classOf = require('./classOf');

const toCurrency = (num, symbol = ',') => {
  const sign = Number(num) >= 0 ? '' : '-';
  const abs = Number(num) >= 0 ? String(num) : String(num).slice(1);
  const string = `${abs}`.split('.');
  const partInt = (string[0] || '0').split('');
  const partFloat = string[1];
  const formatted = partInt.reverse().reduce((res, item, index) => `${item}${(index > 0 && index % 3 === 0) ? symbol : ''}${res}`, '');
  return R.isNil(partFloat) ? `${sign}${formatted}` : `${sing}${formatted}.${partFloat}`;
}

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
