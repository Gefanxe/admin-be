

module.exports = function (f) {
  // Global cors Setting
  // TODO: 正式環境要限制網域(或是不要跟前端不同網域)
  f.register(require('fastify-cors'), (instance) => (req, callback) => {
    let corsOptions;
    // // do not include CORS headers for requests from localhost
    // if (/localhost/.test(origin)) {
    //   corsOptions = { origin: false }
    // } else {
    //   corsOptions = { origin: true }
    // }
    callback(null, corsOptions) // callback expects two parameters: error and options
  })
};
