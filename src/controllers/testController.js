require("dotenv-expand")(require("dotenv").config());
const prisma = require("../instances/prisma");
const axios = require("axios");
axios.defaults.headers.common["Content-Type"] = "application/json";

exports.getTests = async (req, reply) => {
  
  let j = req.user;

  reply.send({result: 'ok'});
};

exports.getToken = async (req, reply) => {
  const _username = req.params.username;

  let tokenPayload = {
    payload: {
      username: _username
    }
  };

  const jwtToken = req.fastify.jwt.sign(tokenPayload, {
    expiresIn: '3h'
  });

  return jwtToken;
};