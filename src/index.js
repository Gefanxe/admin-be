require("dotenv-expand")(require("dotenv").config());
const Fastify = require("fastify");

const start = async () => {

  const fastify = require('./system/init')(Fastify);

  require('./system/staticFolder')(fastify);
  require('./system/cors')(fastify);
  require('./system/jwt')(fastify);
  await require('./system/casbin')(fastify);
  require('./system/multipart')(fastify);
  require('./system/session')(fastify);
  require('./system/swagger')(fastify);
  require('./system/route')(fastify);
  require('./system/validatorCompiler')(fastify);
  require('./system/hook')(fastify);
  require('./system/errorHandle')(fastify);

  try {
    await fastify.listen(process.env.SERVER_PORT);
    fastify.swagger({ yaml: true });
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();