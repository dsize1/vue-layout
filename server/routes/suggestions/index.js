const R = require('ramda');

const queryStocksInfo = require('./queryStocksInfo');
const delay = require('../../utils/delay');

const DEFAULT_QUERY = ['', 1, 0];

const suggestions = async (ctx, next) => {
  const [search, page, ms] = R.pipe(
    R.path(['request, query']),
    R.props(['search', 'page', 'delay']),
    R.map((value, index) => R.defaultTo(DEFAULT_QUERY[index], value))
  )(ctx);
  await delay(ms);
  if (search === '') {
    ctx.body = { code: 0, data: [] };
  } else {
    const data = await queryStocksInfo(R.trim(search), ctx.verbose);
    ctx.body = { code: 1, data };
  }
  await next();
};

module.exports = {
  method: 'get',
  url: '/api/suggestions',
  middleware: suggestions
};
