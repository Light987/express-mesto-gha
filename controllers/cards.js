const httpConstants = require('http2').constants;
const Card = require('../models/card');

const {
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = httpConstants;

module.exports.findCards = (req, res) => {
  Card.find({})
    .then((card) => {
      res.send(card);
    })
    .catch(() => {
      res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Были переданы неверные данные' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else if (card.owner.toString() === req.user._id) {
        card.deleteOne()
          .then(() => {
            res.send({ data: card });
          })
          .catch(() => {
            res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' });
          });
      } else {
        res.status(403).send({ message: 'Это не ваш пост' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Были переданы неверные данные' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' });
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
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Были переданы неверные данные' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' });
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
        res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Были переданы неверные данные' });
      } else {
        res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'Что-то пошло не так' });
      }
    });
};
