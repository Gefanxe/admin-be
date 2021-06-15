const testController = require('../controllers/testController');
const systemController = require('../controllers/systemController');

async function _preValidation(request, reply, done) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
  done();
}

const routes = [
  {
    method: 'GET',
    url: '/test',
    handler: testController.getTests,
    preValidation: _preValidation
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
  // {
  //   method: 'POST',
  //   url: '/user',
  //   handler: testController.getTests
  // },
];

module.exports = routes;
