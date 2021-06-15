const fastifySwagger = require("fastify-swagger");
const swaggerOptions = require("../../config/swagger");

module.exports = async function (f) {
  f.register(fastifySwagger, swaggerOptions.options);
};
