const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const cardRoutes = require('./routes/cards');
const userRoutes = require('./routes/users');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFound = require('./errors/NotFound');
const { loginJoi, createUserJoi } = require('./middlewares/validation');
const errorCenter = require('./middlewares/errorCenter');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signin', loginJoi, login);
app.post('/signup', createUserJoi, createUser);

app.use(auth);
app.use(userRoutes);
app.use(cardRoutes);
app.use(errors());

app.use((req, res, next) => {
  next(new NotFound('Такой страницы нет.'));
});

app.use(errorCenter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
