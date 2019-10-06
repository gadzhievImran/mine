const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { signin } = require('../middlewares');
const { User, validate } = require('../model');

const router = new Router();

router.get('/signup', (req, res) => {
  // if(req.cookies && req.cookies.token) {
  //   const user = User.findOne({ _id: req.user });
  //   if(user) {
  //     res.redirect('/main')
  //   }
  // }
  
  res.render('index');
});

router.post('/signup', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  const { email, password, name } = req.body;
  
  let user = await User.findOne({ email });
  
  if(user) {
    // return res.render('error', {
    //   message: 'Такой пользователь зарегестрирован'
    // });
    
    return res.send({
      data: {
        message: 'Такой пользователь зарегестрирован',
        token: null
      }
    })
  }
  
  user = new User({
    name, email, password
  });
  
  user.password = await bcrypt.hash(user.password, 10);
  await user.save();
  
  const token = user.generateToken();
  res.cookie('token', token);
  res.header('x-auth-token', token)
    .send({
      data: {
        message: 'Вы успешно зарегистрированы',
        token
      }
    })
    // .redirect('signin')
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
    // res.render('error', {
    //   message: 'Такого пользователя нет'
    // })
  
    res.send({
      data: {
        message: 'Такого пользователя нет, зарегистрируйтесь',
        token: null
      }
    })
  }

  if(pass) {
    const token = jwt.sign({ _id: user._id }, 'privateCode');
    res.cookie('token', token);
    res.header('x-auth-token', token);
    res.send({
      data: {
        message: 'Вы авторизованы',
        token
      }
    })
    // res.redirect('/current');
  } else {
    // res.render('error', {
    //   message: 'Пароль неверный'
    // })
    res.send({
      data: {
        message: 'Неверный пароль',
        token: null
      }
    })
  }
});

router.get('/current', (req, res) => {
  res.render('current');
});

router.get('/main', (req, res) => {
  res.render('main');
});

router.post('/current', signin, async (req, res) => {
  console.log(req.user)
  const user = await User.findOne({ _id: req.user._id });
  res.send(user);
});

module.exports = router;
