const router = require('express').Router();

const {
  findCards,
  createCard,
  deleteCard,
  setLike,
  delLike,
} = require('../controllers/cards');

router.get('/', findCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', setLike);
router.delete('/:cardId/likes', delLike);

module.exports = router;
