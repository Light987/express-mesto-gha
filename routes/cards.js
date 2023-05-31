const router = require('express').Router();

const {
  findCards,
  createCard,
  deleteCard,
  setLike,
  delLike,
} = require('../controllers/cards');

const { cardIdJoi, createCardJoi } = require('../middlewares/validation');

router.get('/cards', findCards);
router.post('/cards', createCardJoi, createCard);
router.delete('/cards/:cardId', cardIdJoi, deleteCard);
router.put('/cards/:cardId/likes', cardIdJoi, setLike);
router.delete('/cards/:cardId/likes', cardIdJoi, delLike);

module.exports = router;
