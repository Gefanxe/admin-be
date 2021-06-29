require("dotenv-expand")(require("dotenv").config());

exports.options = {
  // mode: 'static',
  // routePrefix: process.env.ROUTE_PREFIX + "/swagger",
  // exposeRoute: true,
  // specification: {
  //   path: './config/swagger.yaml',
  //   postProcessor: function(yaml) {
  //     yaml.basePath = process.env.ROUTE_PREFIX;
  //     yaml.host = process.env.SERVER_HOST + ':' + process.env.SERVER_PORT;
  //     return yaml
  //   }
  // }

  routePrefix: process.env.ROUTE_PREFIX + "/swagger",
  exposeRoute: true,
  swagger: {
    info: {
      title: "Admin API",
      description: "使用 Node.js, Fastify, Prisma... 製作",
      version: "0.0.1",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
    host: process.env.SERVER_HOST + ':' + process.env.SERVER_PORT,
    schemes: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
      { name: 'system', description: '系統操作相關' },
      { name: 'user', description: '用戶相關' }
    ],
    securityDefinitions: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header"
      }
    },
    basePath: process.env.ROUTE_PREFIX
  }
};
