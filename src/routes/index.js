// controller
const testController = require('../controllers/testController');
const systemController = require('../controllers/systemController');
const userController = require('../controllers/user/userController');

// schema
const { systemLogin } = require('./schema/system');
const { 
  userInfo,
  userCreate
} = require('./schema/user');

// const Ajv = require('ajv');
// const ajv = new Ajv({
//   useDefaults: true,
//   coerceTypes: true,
//   $data: true,
//   extendRefs: true
// });

// ajv.addKeyword('isFileType', {
//   compile: (schema, parent, it) => {
//     parent.type = 'file'
//     delete parent.isFileType
//     return () => true
//   }
// });

const routes = [
  {
    method: 'GET',
    url: '/test',
    handler: testController.getTests,
    preValidation: _jwtValidate,  // JsonWebToken驗證
    casbin: { rest: true }        // 權限驗證
  },
  // !測試用，之後要移除
  {
    method: 'GET',
    url: '/token/:username',
    handler: testController.getToken
  },
  {
    method: 'GET',
    url: '/captcha',
    handler: systemController.getCaptcha
  },
  {
    method: 'POST',
    url: '/login',
    handler: systemController.postLogin,
    schema: systemLogin.schema
  },
  {
    method: 'POST',
    url: '/logout',
    handler: systemController.postLogout,
    preValidation: _jwtValidate
  },
  {
    method: 'POST',
    url: '/user',
    handler: userController.postCreateUser,
    schema: userCreate.schema,
    preValidation: _jwtValidate,
    casbin: { rest: true },
    // validatorCompiler: ({ schema, method, url, httpPart }) => {
    //   return ajv.compile(schema);
    // }
  },
  {
    method: 'PUT',
    url: '/user',
    handler: userController.putUpdateUser,
    // schema: ,
    preValidation: _jwtValidate,
    casbin: { rest: true },
    // validatorCompiler: ({ schema, method, url, httpPart }) => {
    //   return ajv.compile(schema);
    // }
  },
  {
    method: 'GET',
    url: '/user/info',
    handler: userController.getUserInfo,
    schema: userInfo.schema,
    preValidation: _jwtValidate
  }
];

async function _jwtValidate(request, reply, done) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
  done();
}

module.exports = routes;
