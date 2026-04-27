//cards.js
const express = require('express');
const { getCards, createCard, deleteCard, addLike, removeLike } = require('../controllers/cards');
const router = express.Router();


//Devuelve el Json de todas las tarjetas
router.get('/', getCards);

//Crea una nueva tarjeta
router.post('/', createCard);

//Elimina una tarjeta por ID
router.delete('/:cardId', deleteCard);

//Añade un like a una tarjeta
router.put('/:cardId/likes', addLike);

//Quita un like a una tarjeta
router.delete('/:cardId/likes', removeLike);

module.exports = router;

