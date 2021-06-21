require("dotenv-expand")(require("dotenv").config());
const prisma = require("../../instances/prisma");
const toolFunc = require('../../libs/ToolFunc');

// const axios = require("axios");
// axios.defaults.headers.common["Content-Type"] = "application/json";

exports.postCreateUser = async (req, reply) => {
  const resObj = {
    result: false,
    message: '',
    data: {}
  };

  // 所有圖檔
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
    avatar: ''
  };

  const existUser = await prisma.admin_user.count({
    where: {
      username: _newUser.username
    }
  });

  if (existUser > 0) {
    resObj.message = '帳號已存在';
    return resObj;
  }
  
  // 處理大頭圖檔
  let savedFilePathAndName = '';
  if (_avatar.filename !== '') {
    let res = await toolFunc.avatarUpload(_avatar);
    _newUser.avatar = res.displayPathAndName;
    savedFilePathAndName = res.savePathAndName;
  }

  // save new user
  try {
    const createUser = await prisma.admin_user.create({
      data: _newUser
    });

    resObj.result = true;
    resObj.data = createUser;
  } catch (err) {
    // delete avatar
    if (savedFilePathAndName !== '') toolFunc.deleteFile(savedFilePathAndName);
    throw new Error(err);
  }

  reply.send(resObj);
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

  const roles = await req.fastify.casbin.getRolesForUser(user.username);
  user.roles = roles;
  
  reply.send([
    20000,
    '',
    user
  ]);
};