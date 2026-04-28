const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET = 'dev-secret-key' } = process.env;

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor' });
  }
};

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
      return res.status(400).json({ message: 'ID no válido' });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).orFail(() => {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    });
    res.status(200).json(user);
  } catch (err) {
    if (err.statusCode === 404) {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ name, about, avatar, email, password: hashedPassword });

    const userResponse = newUser.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'El correo ya está registrado' });
    }
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos', details: err.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    if (!name || !about) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos', details: err.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const updateAvatarProfile = async (req, res) => {
  try {
    const { avatar } = req.body;
    if (!avatar) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const updatedAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    res.status(200).json(updatedAvatar);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Datos inválidos', details: err.message });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = { getUsers, getUserById, getCurrentUser, createUser, login, updateUserProfile, updateAvatarProfile };
