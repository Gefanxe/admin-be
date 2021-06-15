require("dotenv-expand")(require("dotenv").config());
const routes = require("../routes");

module.exports = function (f) {
  routes.forEach((route, index) => {
    route.url = process.env.ROUTE_PREFIX + route.url;
    f.route(route);
  });
};