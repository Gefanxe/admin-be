const path = require('path');
const fastifyStatic = require('fastify-static');

module.exports = function (f) {

  let r = path.join(path.resolve('./'), 'public');
  
  f.register(fastifyStatic, {
    root: path.join(path.resolve('./'), 'frontend')
  });

  // for public assets
  f.register(fastifyStatic, {
    root: path.join(path.resolve('./'), 'public'),
    prefix: '/public/',
    decorateReply: false  // 不止一個static時，就要加此項
  });
};