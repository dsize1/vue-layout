const R = require('ramda');

const getValuesWithDefault = (path, keys, defaultValue) => R.pipe(
  R.path(path),
  R.props(keys),
  R.addIndex(R.map)((value, index) => R.defaultTo(defaultValue[index], value))
);

module.exports = getValuesWithDefault;
