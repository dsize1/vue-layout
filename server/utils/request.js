const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
const queryString = require('query-string');
const R = require('ramda');
const { ajax } = require('rxjs/ajax');
const { map, catchError } = require('rxjs/operators');

const print = require('./print');

/**
 * @description: polyfill xhr 
 * @return {object} 
 */
const createXHR = () => new XMLHttpRequest();

/**
 * @description:  resp handler
 * @param {function | undefined} 自定义格式化函数 
 * @return {function} 
 */
const mapFunc = (formatter) => (rxResp) => {
  const [statusCode, userResp, responseType] = R.props(['status', 'response', 'responseType'], rxResp);
  const response = typeof formatter === 'function' ?
    formatter(userResp) :
    userResp;
  const { data } = response;
  if (statusCode >= 400) {
    print('response fail', { statusCode, responseType });
    return ['response fail', null];
  }
  print('response success', { statusCode, responseType, userResp });
  return [null, data];
};

/**
 * @description: catch error 
 * @param {any} 
 * @return {array} 
 */
const catchErrorFunc = (error) => {
  print('response fail', { message: error });
  return [error.message, null];
};

/**
 * @description: get封装
 * @param {string} 
 * @param {object} 
 * @return {object} obseverable
 */
const get$ = (url, options = {}) => {
  const query = queryString.stringify(R.prop('query', options) || {});
  const _url = query ? `${url}?${query}` : url;
  const method = 'GET';
  const formatter = R.prop('formatter', options);
  const mapper = mapFunc(formatter);
  const rest = R.omit(['query', 'formatter'], options);
  const config = { url: _url, method, ...rest };

  print('get$', config);
  return ajax({ ...config, createXHR })
    .pipe(
      map(mapper),
      catchError(catchErrorFunc)
    );
};

/**
 * @description: post封装
 * @param {string} 
 * @param {object} 
 * @return {object} obseverable
 */
const post$ = (url, options = {}) => {
  const method = 'POST';
  const formatter = R.prop('formatter', options);
  const mapper = mapFunc(formatter);
  const rest = r.omit(['formatter'], options);
  const config = { url, method, ...rest };

  print('post$', config);
  return ajax({ ...config, createXHR })
    .pipe(
      map(mapper),
      catchError(catchErrorFunc)
    );
}

module.exports = {
  get$,
  post$
};
