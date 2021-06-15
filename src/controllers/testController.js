require("dotenv-expand")(require("dotenv").config());
const prisma = require("../instances/prisma");
const axios = require("axios");
axios.defaults.headers.common["Content-Type"] = "application/json";

exports.getTests = async (req, reply) => {
  
  reply.send({result: 'ok'});
};
