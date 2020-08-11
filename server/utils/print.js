const R = require('ramda');

const classOf = require('./classOf');
const isPrmitive = require('./isPrmitive');

const repeat = (str, len) => R.repeat(str, len).join('');

const WIDTH = 60;

const printKeyConcatValue = (value, key) => {
  const type = classOf(value);
  let valueText = type;
  if (isPrmitive(value)) {
    valueText = JSON.stringify(value);
  } else if (['Object', 'Array'].includes(type)){
    const stringified = JSON.stringify(value);
    if (stringified.length > WIDTH) {
      valueText = `${stringified.slice(0, 46)} ...`;
    } else {
      valueText = stringified;
    }
  }
  console.log('--', `${key}: ${valueText}`)
};

const print = (title = '', context = {}) => {
  const left = repeat('-', Math.ceil((WIDTH - title.length) / 2));
  const right = repeat('-',Math.floor((WIDTH - title.length) / 2));
  const div = `${left}${title}${right}`;
  console.log(div);
  if (classOf(context) === 'Error') {
    console.log(context);
  } else {
    R.forEachObjIndexed(printKeyConcatValue, context);
  }
  console.log(div);
  console.log('\r\n');
};

module.exports = print;
