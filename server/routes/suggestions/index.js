const R = require('ramda');

const queryStocksInfo = require('./queryStocksInfo');
const getRequestQuery = require('../../utils/getValuesWithDefault');
const delay = require('../../utils/delay');

const QUERY_PATH = ['request', 'query'];
const QUERY_KEYS = ['search', 'page', 'pagesize', 'delay']
const QUERY_DEFAULT = ['', 1, 10, 0];

const suggestions = async (ctx, next) => {
  const [search, currPage, pageSize, ms] = getRequestQuery(QUERY_PATH, QUERY_KEYS, QUERY_DEFAULT)(ctx);
  await delay(ms);
  if (search === '') {
    ctx.body = { code: 0, data: [] };
  } else {
    const data = await queryStocksInfo(
      { search: R.trim(search), currPage, pageSize },
      ctx.verbose
    );
    ctx.body = { code: 1, data };
  }
  await next();
};

module.exports = {
  method: 'get',
  url: '/api/suggestions',
  middleware: suggestions
};
