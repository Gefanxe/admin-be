require("dotenv-expand")(require("dotenv").config());
const Fastify = require("fastify");

const start = async () => {

  const fastify = require('./system/logger')(Fastify);

  require('./system/staticFolder')(fastify);
  require('./system/cors')(fastify);
  require('./system/jwt')(fastify);
  await require('./system/casbin')(fastify);
  require('./system/multipart')(fastify);
  require('./system/session')(fastify);
  require('./system/swagger')(fastify);
  require('./system/route')(fastify);
  require('./system/errorHandle')(fastify);

  try {
    await fastify.listen(process.env.SERVER_PORT);
    fastify.swagger();
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();