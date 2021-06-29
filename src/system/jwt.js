require("dotenv-expand")(require("dotenv").config());

module.exports = function (f) {
  const myCustomMessages = {
    badRequestErrorMessage: '50008,Format is Authorization: Bearer [token]',
    noAuthorizationInHeaderMessage: '50000,Autorization header is missing!',
    authorizationTokenExpiredMessage: '50014,登入授權已過期，請重新登入。',
    authorizationTokenInvalid: '50008,登入授權無效。'
  };

  f.register(require('fastify-jwt'), {
    secret: process.env.SECRET_KEY,
    messages: myCustomMessages
  })
};
