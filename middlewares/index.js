const jwt = require('jsonwebtoken');

const signin = function(req, res, next) {
  const token = req.cookies ? req.cookies.token : null ;
  if(!token) res.render('error', {
    message: 'Нет токена'
  });

  const decode = jwt.verify(token, 'privateCode');
  req.user = decode;
  
  next();
};

exports.signin = signin;
