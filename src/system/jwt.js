require("dotenv-expand")(require("dotenv").config());

module.exports = function (f) {
  // 注入物件到特定路徑
  f.decorateRequest('fastify', null);
  f.addHook('preHandler', (req, reply, next) => {
    const routeList = [
      // '/test',
      '/login'
    ];

    // 加入 prefix
    for (let i = 0; i < routeList.length; i++) {
      const item = routeList[i];
      routeList[i] = process.env.ROUTE_PREFIX + item;
    }

    if (routeList.includes(req.routerPath)) {
      req.fastify = f;
    }
    next();
  });

  f.register(require('fastify-jwt'), {
    secret: process.env.SECRET_KEY
  })
};
