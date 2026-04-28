const Card = require('../models/card');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;

    if (!name || !link) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const newCard = await Card.create({
      name,
      link,
      owner: req.user._id,
      likes: [],
      createdAt: new Date(),
    });

    res.status(201).json(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos', details: err.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).orFail(() => {
      const error = new Error('Tarjeta no encontrada');
      error.statusCode = 404;
      throw error;
    });

    if (card.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No tienes permiso para eliminar esta tarjeta' });
    }

    await Card.findByIdAndDelete(cardId);
    res.status(200).json({ message: 'Tarjeta eliminada exitosamente' });
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ message: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID no válido' });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const addLike = async (req, res) => {
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

    res.status(200).json(card);
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ message: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID no válido' });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const removeLike = async (req, res) => {
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

    res.status(200).json(card);
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ message: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID no válido' });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { getCards, createCard, deleteCard, addLike, removeLike };
