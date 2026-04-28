const Card = require('../models/card');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;

    const newCard = await Card.create({
      name,
      link,
      owner: req.user._id,
      likes: [],
      createdAt: new Date(),
    });

    return res.status(201).json(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const error = new Error('Datos inválidos');
      error.statusCode = 400;
      return next(error);
    }
    return next(err);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).orFail(() => {
      const error = new Error('Tarjeta no encontrada');
      error.statusCode = 404;
      throw error;
    });

    if (card.owner.toString() !== req.user._id.toString()) {
      const error = new Error('No tienes permiso para eliminar esta tarjeta');
      error.statusCode = 403;
      return next(error);
    }

    await Card.findByIdAndDelete(cardId);
    return res.status(200).json({ message: 'Tarjeta eliminada exitosamente' });
  } catch (err) {
    if (err.name === 'CastError') {
      const error = new Error('ID no válido');
      error.statusCode = 400;
      return next(error);
    }
    return next(err);
  }
};

const addLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).orFail(() => {
      const error = new Error('Tarjeta no encontrada');
      error.statusCode = 404;
      throw error;
    });

    return res.status(200).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      const error = new Error('ID no válido');
      error.statusCode = 400;
      return next(error);
    }
    return next(err);
  }
};

const removeLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).orFail(() => {
      const error = new Error('Tarjeta no encontrada');
      error.statusCode = 404;
      throw error;
    });

    return res.status(200).json(card);
  } catch (err) {
    if (err.name === 'CastError') {
      const error = new Error('ID no válido');
      error.statusCode = 400;
      return next(error);
    }
    return next(err);
  }
};

module.exports = {
  getCards, createCard, deleteCard, addLike, removeLike,
};
