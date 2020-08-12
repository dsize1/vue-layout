/**
 * @description: 注册路由中间件 
 * @param {object} router 
 * @return {function} 
 */
const useRouter = (router) => 
  ({ method, url, middleware }) => router[method.toLowerCase()](url, middleware);

module.exports = useRouter;
