const router = require('express').Router();

const {
  getUsers,
  getUser,
  createUser,
  editUser,
  editAvatar,
} = require('../controllers/users');

const { userIdJoi, updateUserJoi, updateAvatarJoi } = require('../middlewares/validation');

router.get('/users', getUsers);
router.get('/users/:userId', userIdJoi, getUser);
router.get('/users/me', getUser);
router.post('/users', createUser);
router.patch('/users/me', updateUserJoi, editUser);
router.patch('/users/me/avatar', updateAvatarJoi, editAvatar);
module.exports = router;
