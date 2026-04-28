const express = require('express');
const {
  getCards, createCard, deleteCard, addLike, removeLike,
} = require('../controllers/cards');
const { validateCardBody, validateCardId } = require('../middleware/validation');

const router = express.Router();

router.get('/', getCards);
router.post('/', validateCardBody, createCard);
router.delete('/:cardId', validateCardId, deleteCard);
router.put('/:cardId/likes', validateCardId, addLike);
router.delete('/:cardId/likes', validateCardId, removeLike);

module.exports = router;
