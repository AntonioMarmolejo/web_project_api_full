const express = require('express');
const {
  getUsers, getUserById, getCurrentUser, updateUserProfile, updateAvatarProfile,
} = require('../controllers/users');
const {
  validateUserId, validateUpdateProfile, validateUpdateAvatar,
} = require('../middleware/validation');

const router = express.Router();

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateUpdateProfile, updateUserProfile);
router.patch('/me/avatar', validateUpdateAvatar, updateAvatarProfile);

module.exports = router;
