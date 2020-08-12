const R = require('ramda');

const fixedNumber = require('../../utils/fixedNumber');

const judgeSameGroup = (freq) => (a, b) => {
  const dateA = new Date(a.datetime);
  const dateB = new Date(b.datetime);
  const monthA = dateA.getMonth();
  const monthB = dateB.getMonth();
  const yearA = dateA.getFullYear();
  const yearB = dateB.getFullYear();
  return (freq === 'annual' || monthA === monthB) && yearA === yearB; 
};

const formatReducer = (acc, item) => {
  acc.high = R.max(acc.high, item.high);
  acc.low = R.min(acc.low, item.low);
  acc.volume = acc.volume + item.volume;
  return acc;
} 

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

// freq: ['daily', 'monthly', 'annual']
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
