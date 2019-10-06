const jwt = require('jsonwebtoken');

const signin = function(req, res, next) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];
  
  console.log(res.header);
  console.log(token);
  next();
};

exports.signin = signin;
