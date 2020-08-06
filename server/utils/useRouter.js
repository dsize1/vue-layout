const useRouter = (router) => 
  ({ method, url, middleware }) => router[method.toLowerCase()](url, middleware);

module.exports = useRouter;
