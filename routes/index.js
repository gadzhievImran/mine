const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { signin } = require('../middlewares');
const { User, validate } = require('../model');

const router = new Router();

router.get('/', (req, res) => {
  res.render('index')
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
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
    res.redirect('/current');
  } else {
    res.render('error', {
      message: 'Пароль неверный'
    })
  }
});

router.get('/current', (req, res) => {
  res.render('current');
});


router.post('/current', signin, async (req, res) => {
  console.log(req.user)
  const user = await User.findOne({ _id: req.user._id });
  res.send(user);
});

module.exports = router;
