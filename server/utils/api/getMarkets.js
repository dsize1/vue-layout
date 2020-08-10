const ajax = require('rxjs/ajax');
const { map, catchError } = require('rxjs/operators');

const apiKey = 'f6a7d09ad27d2fe2afdb15dc76b15076';

const getMarkets = () => {
  const result = ajax.getJSON({
    url: `https://api.trochil.cn/v1/cnstock/markets?apikey=${apiKey}`,
    method: 'GET'
  }).pipe(
    map(resp => {
      const { data, status } = resp;
      if (status === 'ok') {
        console.log('ok', resp.status);
        return [data];
      }
      return [[], 'getMarkets failed']
    }),
    catchError(error => {

    })
  )
    return result;
};

module.exports = getMarkets;
