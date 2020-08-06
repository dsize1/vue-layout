const oneDay = 1000 * 60 * 60 * 24;

const load = async (ctx, next) => {
  const query = ctx.request.query;
  const { start, end } = query;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if ( endDate - startDate < oneDay * 10 ) {
    const body = JSON.stringify({ code: 0, data: { data: [], columnDim: [] } });
    ctx.body = body;
  } else {
    const dayN = (endDate - startDate) / oneDay;
    const tableData = new Array(dayN).fill(0).map((_, index) => ({
      name: `name_${index}`,
      address: `address_${index}`,
      time: `time_${index}`
    }));
    const columnDim = [
      { title: 'name', align: 'center', style: { color: 'blue', fontWeight: 'bold' } },
      { title: 'address', align: 'right' },
      { title: 'time', align: 'left' }
    ];
    const body = JSON.stringify({ code: 1, data: { data: tableData, columnDim } });
    ctx.body = body; 
  }
  await next();
};

module.exports = {
  method: 'get',
  url: '/api/load',
  middleware: load
};
