const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255
  }
});

UserSchema.methods.generateToken = function() {
  const token = jwt.sign({ _id: this._id }, 'privateCode');
  return token;
};

const User = mongoose.model('User', UserSchema);

function validate(user) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(3).max(255).required()
  };
  
  return Joi.validate(user, schema);
};

exports.User = User;
exports.validate = validate;

