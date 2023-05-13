const express = require('express');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const app = express();
const { PORT = 3000 } = process.env;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '645f413600e8e306144ad5c8',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use((_, res) => {
  res.status(404).send({ message: 'Маршрут не найден' });
});

app.listen(PORT, () => {
  console.log(`Приложение запускается с порта ${PORT}`);
});
