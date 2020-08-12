const print = require('../utils/print');

const logger = () => async (ctx, next) => {
  const startTime = Date.now();
  const context = {
    url: ctx.request.url,
    method: ctx.request.method,
    query: JSON.stringify(ctx.request.query),
    body: ctx.request.body
  };
  try {
    await next();
    print(
      'request',
      {
        ...context,
        'time(ms)': Date.now() - startTime
      }
    );
  } catch (err) {
    ctx.status = 500;
    ctx.response.message = JSON.stringify({ code: 2, msg: err.message });
    print(
      'request',
      {
        ...context,
        error: err.message
      }
    );
  }
};

module.exports = logger;
