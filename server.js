const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors')

const router = require('./routes');

const app = express();

app.set('view engine', 'pug');
app.use(express.urlencoded());
app.use(express.static('public'));
app.use(cookieParser());
app.use(express.json());
app.use(cors());

mongoose
  .connect('mongodb://localhost/mine', { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.log(e.message));

app.use(router);

app.listen(3001, () => console.log('the server has been started...'));
