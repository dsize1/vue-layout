const realtime = async (ctx, next) => {
  const { frequency } = ctx.request.body;

};

module.exports = {
  method: 'post',
  url: '/api/realtime',
  middleware: realtime
};
