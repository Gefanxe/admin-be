require("dotenv-expand")(require("dotenv").config());

module.exports = function (f) {
  const fastify = f({
    logger: {
      prettyPrint: {
        colorize: false,
        translateTime: 'SYS:STANDARD',
        ignore: 'pid,hostname,reqId,responseTime,req,res'
      },
      level: 'error',
      file: process.env.LOG_FILE
    }
  });
  return fastify;
};