const R = require('ramda');

const classOf = require('./classOf');

module.exports = {
  isNum: R.compose(R.equals('Number'), classOf),
  isStr: R.compose(R.equals('String'), classOf),
  isBool: R.compose(R.equals('Boolean'), classOf),
  isSym: R.compose(R.equals('Symbol'), classOf),
  isArr: R.compose(R.equals('Array'), classOf),
  isObj: R.compose(R.equals('Object'), classOf),
  isFunc: R.compose(R.equals('Function'), classOf)
};
