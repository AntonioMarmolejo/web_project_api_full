const express = require('express');
const { getUsers, getUserById, getCurrentUser, updateUserProfile, updateAvatarProfile } = require('../controllers/users');

const router = express.Router();

router.get('/me', getCurrentUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.patch('/me', updateUserProfile);
router.patch('/me/avatar', updateAvatarProfile);

module.exports = router;
