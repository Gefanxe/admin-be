

module.exports = function (f) {
  f.register(require("fastify-multipart"), {
    limits: {
      fileSize: 52428800, // 52428800
      files: 10,
    },
    attachFieldsToBody: true
  });
};
