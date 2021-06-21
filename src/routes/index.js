const testController = require('../controllers/testController');
const systemController = require('../controllers/systemController');
const userController = require('../controllers/user/userController');

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
    handler: systemController.postLogin
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
    preValidation: _jwtValidate,  // JsonWebToken驗證
    casbin: { rest: true }        // 權限驗證
  },
  {
    method: 'GET',
    url: '/user/info',
    handler: userController.getUserInfo,
    preValidation: _jwtValidate
  },
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
