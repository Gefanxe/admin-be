module.exports = function (f) {
  // Global Error Handle
  f.setErrorHandler(function (error, request, reply) {
    
    // 被swagger驗證到的
    if (error.validation) {
      let eMsg = '';
      error.validation.forEach(function(item, idx, arr) {
        eMsg += '* ' + item.instancePath.replace('/', '') + ' ' + item.message + "<br>";
      });
      return reply.send({
        code: 42200,
        message: eMsg
      });
    }

    if (error.name === 'UnauthorizedError') {
      const [_code, _msg] = error.message.split(',');

      return reply.send({
        code: parseInt(_code, 10),
        message: _msg
      });
    }

    let errMsg = error.message;
    let statusCode = 500;

    // TODO: 之後數量多了要分類
    let _ts = `(${Date.now().toString()})`;
    request.log.error(_ts + error.stack);

    reply
      .type("application/json")
      .status(statusCode)
      .send({
        code: 50000,
        message: _ts + errMsg,
      });
  });

  // set not found handler
  f.setNotFoundHandler(function (request, reply) {
    reply.code(404).type("application/json").send({
      code: 40400,
      message: "web api not found",
    });
  });
};
