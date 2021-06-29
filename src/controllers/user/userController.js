require("dotenv-expand")(require("dotenv").config());
const prisma = require("../../instances/prisma");
const toolFunc = require('../../libs/ToolFunc');
const err = require('../../system/errorList');

// const axios = require("axios");
// axios.defaults.headers.common["Content-Type"] = "application/json";

exports.postCreateUser = async (req, reply) => {

  // 圖檔
  const _avatar = await req.body.avatar;

  // 所有表單欄位
  const input = Object.fromEntries(Object.keys(req.body).map((key) => [key, req.body[key].value]));

  const hashPwd = toolFunc.hashPassword(input.password);
  
  const _newUser = {
    username: input.username,
    password: hashPwd.hashPwd,
    salt: hashPwd.salt,
    name: input.name,
    email: input.email,
    avatar: '',
    introduction: input.introduction
  };

  const existUser = await prisma.admin_user.count({
    where: {
      username: _newUser.username
    }
  });

  if (existUser > 0) return reply.send(err[40005]);
  
  // 處理大頭圖檔
  let savedFilePathAndName = '';
  if (_avatar.filename !== '') {
    let res = await toolFunc.avatarUpload(_avatar);
    _newUser.avatar = res.displayPathAndName;
    savedFilePathAndName = res.savePathAndName;
  }

  // save new user
  let createUser;
  try {
    createUser = await prisma.admin_user.create({
      data: _newUser
    });
  } catch (err) {
    // delete avatar
    if (savedFilePathAndName !== '') toolFunc.deleteFile(savedFilePathAndName);
    throw new Error(err);
  }

  reply.send([20000, '', createUser]);
};

exports.putUpdateUser = async (req, reply) => {
  // 圖檔
  const _avatar = await req.body.avatar;

  // 所有表單欄位
  const input = Object.fromEntries(Object.keys(req.body).map((key) => [key, req.body[key].value]));

  const _data = {
    name: input.name,
    email: input.email,
    introduction: input.introduction
  };

  // 處理大頭圖檔
  let savedFilePathAndName = '';
  if (_avatar.filename !== '') {
    let res = await toolFunc.avatarUpload(_avatar);
    _data.avatar = res.displayPathAndName;
    savedFilePathAndName = res.savePathAndName;
  }

  const updateUser = await prisma.admin_user.update({
    where: {
      username: input.username
    },
    data: _data
  });

  if (!updateUser) {
    if (savedFilePathAndName !== '') toolFunc.deleteFile(savedFilePathAndName);
    return reply.send(err[40004]);
  }

  reply.send([20000, '', updateUser]);
};

exports.getUserInfo = async (req, reply) => {

  const jwtUser = req.user.payload;
  
  const user = await prisma.admin_user.findFirst({
    where: {
      id: jwtUser.id,
      del: false
    },
    select: {
      username: true,
      name: true,
      avatar: true,
      email: true,
      introduction: true,
      last_login_ip: true,
    }
  });

  if (!user) return reply.send(err[40002]);

  const roles = await req.fastify.casbin.getRolesForUser(user.username);
  user.roles = roles;
  
  reply.send([
    20000,
    '',
    user
  ]);
};