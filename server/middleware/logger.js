const logger = () => async (ctx, next) => {
  const startTime = Date.now();
  try {
    console.log('----------------------------');
    console.log('request url:', ctx.request.url);
    console.log('request method:', ctx.request.method);
    console.log('request query:', JSON.stringify(ctx.request.query));
    console.log('request body:', ctx.request.body);
    await next();
    console.log('response time(ms):', Date.now() - startTime);
    console.log('----------------------------');
  } catch (msg) {
    ctx.status = 500;
    console.log('response error:', msg);
    console.log('----------------------------');
    ctx.response.message = JSON.stringify({ code: 2, msg });
  }
};

module.exports = logger;
