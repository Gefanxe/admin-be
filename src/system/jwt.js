require("dotenv-expand")(require("dotenv").config());

module.exports = function (f) {
  f.register(require('fastify-jwt'), {
    secret: process.env.SECRET_KEY
  })
};
