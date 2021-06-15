

module.exports = function (f) {
  // Global Error Handle
  f.setErrorHandler(function (error, request, reply) {
    
    let errMsg = error.message;
    let statusCode = 500;

    reply.type('application/json').status(statusCode).send({
      result: false,
      message: errMsg
    });
  })

  // set not found handler
  f.setNotFoundHandler(function (request, reply) {
    reply.code(404).type('application/json').send({
      result: false,
      message: 'web api not found'
    });
  });
};