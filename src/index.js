require("dotenv-expand")(require("dotenv").config());

const fastify = require("fastify")({
  logger: true
});

// Run the server!
// TODO: where to log error?
const start = async () => {

  // register
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
    // console.log('fastify: ', fastify);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();