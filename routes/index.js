const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { signin } = require('../middlewares');
const User = require('../model');

const router = new Router();

router.get('/', (req, res) => {
  res.render('index')
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  
  let user = await User.findOne({ email });
  
  if(user) {
    return res.render('error', {
      message: 'Такой пользователь зарегестрирован'
    });
  }
  
  user = new User({
    email, password
  });
  
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();
  
  const token = user.generateToken();
  res.cookie('token', token);
  res.header('x-auth-token', token)
    .redirect('signin')
});

router.get('/signin', (req, res) => {
  res.render('signin');
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  let pass;
  
  if(user) {
    pass = await bcrypt.compare(password, user.password);
  } else {
    res.render('error', {
      message: 'Такого пользователя нет'
    })
  }

  if(pass) {
    const token = jwt.sign({ _id: user._id }, 'privateCode');
    res.cookie('token', token);
    res.header('x-auth-token', token);
    res.render('main');
  } else {
    res.render('error', {
      message: 'Пароль неверный'
    })
  }
});

module.exports = router;
