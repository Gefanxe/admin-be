require("dotenv-expand")(require("dotenv").config());

exports.options = {
  mode: 'static',
  routePrefix: "/swagger",
  exposeRoute: true,
  specification: {
    path: './config/swagger.yaml',
    postProcessor: function(yaml) {
      yaml.host = process.env.SERVER_HOST;
      return yaml
    },
    baseDir: '/',
  }
};
