const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

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

module.exports = User;
