require("dotenv-expand")(require("dotenv").config());
const path = require('path');
const mysql = require("mysql2");
const { BasicAdapter } = require("casbin-basic-adapter2");
const { Model } = require('casbin');

module.exports = async function (f) {

  const _conf = `
    [request_definition]
    r = sub, obj, act
    
    [role_definition]
    g = _, _
    
    [policy_definition]
    p = sub, obj, act
    
    [policy_effect]
    e = some(where (p.eft == allow))
    
    [matchers]
    m = (keyMatch(r.sub, p.sub) || g(r.sub, p.sub)) && keyMatch(r.obj, p.obj) && regexMatch(r.act, p.act) || r.sub == "root"
  `;

  let _model = new Model();
  _model.loadModelFromText(_conf);

  const _conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
  });

  const _adapter = await BasicAdapter.newAdapter("mysql", _conn);
  f.register(require("fastify-casbin"), {
    model: _model,
    adapter: _adapter
  });

  // register and configure casbin-rest plugin
  f.register(require('fastify-casbin-rest'), {
    getSub: r => r.user.payload.username
  })
  
};
