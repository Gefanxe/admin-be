require("dotenv-expand")(require("dotenv").config());
const path = require('path');
const fs = require('fs');
const swagger = require("../config/swagger");

const routePrefix = '/api';

const fastify = require("fastify")({
  logger: true
});

fastify.register(require('fastify-static'), {
  root: path.join(path.resolve('./'), 'public'),
  prefix: '/public/'
})

// Global cors Setting
// TODO: 正式環境要限制網域
fastify.register(require('fastify-cors'), (instance) => (req, callback) => {
  let corsOptions;
  // // do not include CORS headers for requests from localhost
  // if (/localhost/.test(origin)) {
  //   corsOptions = { origin: false }
  // } else {
  //   corsOptions = { origin: true }
  // }
  callback(null, corsOptions) // callback expects two parameters: error and options
})

// JWT
fastify.register(require('fastify-jwt'), {
  secret: process.env.SECRET_KEY
})

// register casbin plugin
fastify.register(require('fastify-casbin'), {
  model: path.join(path.resolve('./config'), 'rest_model.conf'),
  adapter: path.join(path.resolve('./config'), 'rest_policy.csv')
})

// register and configure casbin-rest plugin
fastify.register(require('fastify-casbin-rest'), {
  getSub: r => r.user.payload.username
})

fastify.register(require('fastify-multipart'), { 
  limits: {
    fileSize: 52428800, // 52428800
    files: 10
  },
  attachFieldsToBody: true 
});

fastify.register(require('fastify-secure-session'), {
  cookieName: 'my-session-cookie',
  key: fs.readFileSync(path.join(path.resolve('./config'), 'secret-key')),
  cookie: {
    path: '/'
  }
});

// Global Error Handle
fastify.setErrorHandler(function (error, request, reply) {
  
  let errMsg = error.message;
  let statusCode = 500;

  reply.type('application/json').status(statusCode).send({
    result: false,
    message: errMsg
  });
})

// swagger
fastify.register(require("fastify-swagger"), swagger.options);

// 注入物件到特定路徑
fastify.decorateRequest('fastify', null);
const includeFastifyObjPath = [
  // routePrefix + '/test',
  routePrefix + '/login'
];
fastify.addHook('preHandler', (req, reply, next) => {
  // if (includeFastifyObjPath.includes(req.routerPath)) {
    req.fastify = fastify;
  // }
  next();
});

// jwt & casbin validate path handler
// const excludeValidatePath = [
//   routePrefix + '/test',
//   routePrefix + '/captcha',
//   routePrefix + '/login',
//   routePrefix + '/public'
// ];
// fastify.addHook("onRequest", async (request, reply) => {
//   try {
//     // 陣列路徑以外的要驗證JWT
//     let result = excludeValidatePath.find(function(item, index, array) {
//       if (request.routerPath) return request.routerPath.includes(item);
//     }) || '';
//     if (result === '') {
//       await request.jwtVerify();
//     }

//   } catch (err) {
//     reply.send(err); // 格式統一在 fastify.setErrorHandler 處理
//   }
// });

// fastify.decorateRequest('authenticate', async function(request, reply) {
//   try {
//     await request.jwtVerify()
//   } catch (err) {
//     reply.send(err)
//   }
// });

const routes = require("./routes");
routes.forEach((route, index) => {
  route.url = routePrefix + route.url;
  // if (!excludeValidatePath.includes(route.url)) {
  //   route.casbin = {
  //     rest: true
  //   };
  // }
  fastify.route(route);
});

// set not found handler
fastify.setNotFoundHandler(function (request, reply) {
  reply.code(404).type('application/json').send({
    result: false,
    message: 'web api not found'
  });
});

// Run the server!
// TODO: where to log error?
const start = async () => {
  try {
    await fastify.listen(process.env.SERVER_PORT);
    fastify.swagger();
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
    // console.log('fastify: ', fastify);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
