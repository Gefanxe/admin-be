const json = require('json-keys-sort');

module.exports = async function (f) {
  // 注入物件到特定路徑
  f.decorateRequest('fastify', null);
  f.addHook('preHandler', (req, reply, next) => {
    const routeList = [
      '/token/:username',  // !測試用，之後要移除
      '/login',
      '/user/info'
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

  f.addHook('preSerialization', (request, reply, payload, done) => {
    if (Array.isArray(payload)) {
      const newPayload = {
        code: payload[0],
        message: payload[1],
        data: payload[2] ?? null
      };
      done(null, newPayload);
    } else {
      done(null, payload);
    }
  });
};
