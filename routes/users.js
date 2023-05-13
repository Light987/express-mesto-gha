const router = require('express').Router();

const {
  findUsers,
  findUserById,
  createUser,
  editUser,
  editAvatar,
} = require('../controllers/users');

router.get('/', findUsers);
router.get('/:userId', findUserById);
router.post('/', createUser);
router.patch('/me', editUser);
router.patch('/me/avatar', editAvatar);
module.exports = router;
