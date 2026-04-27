const User = require('../models/user');

//Obtener todos los usuarios
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    console.error(err);//Para depurar en el servidor
    res.status(500).json({ message: 'Error del servidor' })
  }
};

//Obtener un usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).orFail(() => {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    });

    res.status(200).json(user);

  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ message: err.message });
    }

    if (err.name === 'CastError') {
      return res.status(400).json({ message: 'ID no válido' })
    }
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' })
  }
};

//Crear un nuevo usuario
const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;

    if (!name || !about || !avatar) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const newUser = await User.create({ name, about, avatar });
    res.status(201).json(newUser);

  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos', details: err.message });
    }
    console.error(err);//Par depurar en el servidor
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

//Actualizar un usuario por ID
const updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    if (!name || !about) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    const updateUser = await User.findByIdAndUpdate(req.user._id, //Id del usuario
      { name, about }, //Nuevos datos
      { new: true, runValidators: true } //Opciones: Devolver el documento actualizado
    )
    res.status(200).json(updateUser);

  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos', details: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

//Actualizar el avatar
const updateAvatarProfile = async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' })
    }

    const updateAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true } //Opciones: Devolver el documento actualizado
    )

    res.status(200).json(updateAvatar);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos', details: err.message });
    }
    console.error(err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
}

module.exports = { getUsers, getUserById, createUser, updateUserProfile, updateAvatarProfile };