const mongoose = require('mongoose');
const config = require('config');
const jwt = require('jsonwebtoken');
const joi = require('joi');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true
  }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({_id: this._id, name: this.name}, config.get('jwtPrivateKey'));
  return token;
}

const User = mongoose.model('User', userSchema);

function validateUser(user) {
  const schema = {
    name: joi.string().min(5).max(50).required(),
    email: joi.string().min(5).max(50).required().email(),
    password: joi.string().min(5).max(1024).required(),
  }

  return joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;