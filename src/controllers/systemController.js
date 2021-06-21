require("dotenv-expand")(require("dotenv").config());
const prisma = require("../instances/prisma");
const toolFunc = require('../libs/ToolFunc');
const svgCaptcha = require('svg-captcha');
const err = require('../system/errorList');
// const axios = require("axios");
// axios.defaults.headers.common["Content-Type"] = "application/json";

exports.getCaptcha = async (req, reply) => {
  let captcha = svgCaptcha.create({
    ignoreChars: '0oO1lIi',
    noise: 4,
    width: 180,
    height: 40,
    fontSize: 40
    // background: '#ffffff',
    // color: false
  });
  

  req.session.set('captcha', captcha.text)
	reply.type('image/svg+xml');
	reply.status(200).send(captcha.data);
};

exports.postLogin = async (req, reply) => {

  const _clientIp = req.body.ip;
  const _username = req.body.username;
  const _password = req.body.password;
  const _captcha = req.body.captcha;

  // check captcha
  if (req.session.get('captcha') !== _captcha) {
    return reply.send(err[50001]);
  }
  
  // check user exist
  const user = await prisma.admin_user.findUnique({
    where: {
      username: _username
    }
  });

  if (!user) {
    return reply.send(err[50002]);
  }

  // validate password hash with salt
  const hashInputPwd = toolFunc.hashString(_password, user.salt);

  if (user.password !== hashInputPwd) {
    // TODO: limit password error login for a while
    return reply.send(err[50003]);
  }

  // update login ip
  const ipUpdate = await prisma.admin_user.update({
    where: {
      username: _username
    },
    data: {
      last_login_ip: _clientIp
    }
  });

  // 成功
  if (!ipUpdate) return reply.send(err[50004]);

  let tokenPayload = {
    payload: {
      id: user.id,
      username: _username,
      clientip: _clientIp
    }
  };

  const jwtToken = req.fastify.jwt.sign(tokenPayload, {
    expiresIn: process.env.JWT_EXPIRY
  });

  const data = {
    token: jwtToken
  };

  reply.send([20000, '', data]);
};

exports.postLogout = async (req, reply) => {

  const result = [
    20000,
    '',
    'success'
  ];
  
  reply.send(result);
};