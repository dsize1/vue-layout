const candlestick = async (ctx, next) => {
  const { frequency, start, end } = ctx.request.body;
  const resp = await fetch('localhost:8989/api/load?start=2010-10-10&end=2011-10-10');

  await next();
};

module.exports = {
  method: 'post',
  url: '/api/candlestick',
  middleware: candlestick
};
