const card = require('../models/card');
const Card = require('../models/card');

//Obtener todas las tarjetas
const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.status(200).json(cards);
  } catch (err) {
    console.error(err); //Para depurar en la consola
    res.status(500).json({ message: 'Error en el servidor' })
  }
};

//Crear una nueva tarjeta
const createCard = async (req, res) => {
  try {
    const { name, link } = req.body; //Recibe el nombre y el enlace de la imagen

    if (!name || !link) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }


    //Crear la tarjeta en la base de datos
    const newCard = await Card.create({
      name,
      link,
      owner: req.user._id, //Asignamos el valor owner desde el middleware
      likes: [], //Se inicializa vacía
      createdAt: new Date()
    });

    res.status(201).json(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos', details: err.message })
    }
    console.error(err); //Para depurar en la consola
    res.status(500).json({ message: 'Error en el servidor' })
  }
};

//Eliminar una tarjeta por su _id DELETE
const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).orFail(() => {
      const error = new Error('Tarjeta no encontrada');
      error.statusCode = 404;
      throw error;
    });

    if (card.owner.toString() !== req.user._id) {
      return res.status(403).json({ message: 'No tienes permiso para liminar esta tarjeta' })
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
    console.error(err); //Para depurar en la consola
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

//Agregar like a una tarjeta PUT
const addLike = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },//Agregar el ID del usuario al array de likes si aun no está
      { new: true }
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
}

//Quitar un like de la tarjeta
const removeLike = async (req, res) => {
  try {
    const card = Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } }, //Quitar el ID del usuario del array de likes
      { new: true }
    ).orFail(() => {
      const error = new Error('Tarjeta no encontrada');
      error.statusCode = 404;
      throw error;
    });

    res.status(200).json(card);
  } catch (err) {
    if (err.statusCode === 404) {
      res.status(404).json({ message: err.message });
    }
    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID no válido' });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
}


module.exports = { getCards, createCard, deleteCard, addLike, removeLike };