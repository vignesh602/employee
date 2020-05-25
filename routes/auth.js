const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const joi = require('joi')
const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('invalid email or password');

  const result = await bcrypt.compare(req.body.password, user.password)
  if (!result) return res.status(400).send('invalid email or password');

  const token = user.generateAuthToken();
  res.send(token);

});

function validate(req) {
  const schema = {
    email: joi.string().min(5).max(50).required().email(),
    password: joi.string().min(5).max(1024).required(),
  }

  return joi.validate(req, schema);
}

module.exports = router;
