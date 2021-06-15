const path = require('path');
const fs = require('fs');

module.exports = function (f) {
  f.register(require('fastify-secure-session'), {
    cookieName: 'my-session-cookie',
    key: fs.readFileSync(path.join(path.resolve('./config'), 'secret-key')),
    cookie: {
      path: '/'
    }
  });
};
