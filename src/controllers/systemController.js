require("dotenv-expand")(require("dotenv").config());
const prisma = require("../instances/prisma");
const axios = require("axios");
const svgCaptcha = require('svg-captcha');
axios.defaults.headers.common["Content-Type"] = "application/json";

exports.getCaptcha = async (req, reply) => {
  let captcha = svgCaptcha.create();

  req.session.set('captcha', captcha.text)
	reply.type('image/svg+xml');
	reply.status(200).send(captcha.data);
};

exports.postLogin = async (req, reply) => {
  const resObj = {
    result: false,
    message: ''
  };

  const _clientIp = req.body.ip;
  const _username = req.body.username;
  const _password = req.body.password;

  let tokenPayload = {
    payload: {
      username: _username,
      clientip: _clientIp
    }
  };


  const jwtToken = req.fastify.jwt.sign(tokenPayload, {
    expiresIn: process.env.JWT_EXPIRY
  });

  reply.send(jwtToken);
};
