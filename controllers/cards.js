const Card = require('../models/card');

module.exports.findCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(() => {
      res.status(500).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Были переданы неверные данные' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else if (card.owner.toString() === req.user._id) {
        Card.deleteOne()
          .then(() => {
            res.status(200).send({ data: card });
          })
          .catch(() => {
            res.status(500).send({ message: 'Что-то пошло не так' });
          });
      } else {
        res.status(403).send({ message: 'Это не ваш пост' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Были переданы неверные данные' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Были переданы неверные данные' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.delLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточка не найдена' });
      } else {
        res.status(200).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Были переданы неверные данные' });
      } else {
        res.status(500).send({ message: 'Что-то пошло не так' });
      }
    });
};
