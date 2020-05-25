const users = require('./routes/users');
const config = require('config');
const auth = require('./routes/auth')
const mongoose = require('mongoose');
const express = require('express');
const app = express();

if(!config.get('jwtPrivateKey')) {
  console.error('FATAL: jwt private key is not defined');
  process.exit(1);
}

mongoose.connect('mongodb://localhost/employee', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch(err => console.log('Failed to connect MongoDB'));

app.use(express.json());
app.use('/api/users', users);
app.use('/api/auth', auth);
require('./startup/prod')(app);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`listening to port ${port}`));
