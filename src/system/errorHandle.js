

module.exports = function (f) {
  // Global Error Handle
  f.setErrorHandler(function (error, request, reply) {
    
    let errMsg = error.message;
    let statusCode = 500;

    // TODO: 之後數量多了要分類
    let _ts = `(${Date.now().toString()})`;
    request.log.error(_ts + error.stack);

    reply.type('application/json').status(statusCode).send({
      code: 50000,
      message: _ts + errMsg
    });
  })

  // set not found handler
  f.setNotFoundHandler(function (request, reply) {
    reply.code(404).type('application/json').send({
      code: 40400,
      message: 'web api not found'
    });
  });
};