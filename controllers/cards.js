const cardSchema = require('../models/card');
const NotFound = require('../errors/NotFound');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

module.exports.getCards = (req, res, next) => {
  cardSchema.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  cardSchema.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы неверные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  cardSchema.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFound('Карточка с таким id не найдена.');
      }
      if (req.user._id.toString() !== card.owner._id.toString()) {
        throw new Forbidden('Нельзя удалить карточку другого пользователя!');
      }
      return card
        .deleteOne()
        .then(() => res.status(200).send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы неверные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.likeCard = (req, res, next) => cardSchema.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFound('Карточка с таким id не найдена.');
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданы неверные данные.'));
    } else {
      next(err);
    }
  });

module.exports.dislikeCard = (req, res, next) => cardSchema.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
)

  .then((card) => {
    if (!card) {
      throw new NotFound('арточка с таким id не найдена.');
    }
    return res.send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequest('Переданы неверные данные.'));
    } else {
      next(err);
    }
  });
