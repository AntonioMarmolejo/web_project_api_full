const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { JWT_SECRET = 'dev-secret-key' } = process.env;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).orFail(() => {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    });
    return res.status(200).json(user);
  } catch (err) {
    if (err.name === 'CastError') {
      const error = new Error('ID no válido');
      error.statusCode = 400;
      return next(error);
    }
    return next(err);
  }
};

const getCurrentUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).orFail(() => {
      const error = new Error('Usuario no encontrado');
      error.statusCode = 404;
      throw error;
    });
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name, about, avatar, email, password: hashedPassword,
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;
    return res.status(201).json(userResponse);
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('El correo ya está registrado');
      error.statusCode = 409;
      return next(error);
    }
    if (err.name === 'ValidationError') {
      const error = new Error('Datos inválidos');
      error.statusCode = 400;
      return next(error);
    }
    return next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      const error = new Error('Correo o contraseña incorrectos');
      error.statusCode = 401;
      return next(error);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error('Correo o contraseña incorrectos');
      error.statusCode = 401;
      return next(error);
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res.status(200).json({ token });
  } catch (err) {
    return next(err);
  }
};

const updateUserProfile = async (req, res, next) => {
  try {
    const { name, about } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    return res.status(200).json(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const error = new Error('Datos inválidos');
      error.statusCode = 400;
      return next(error);
    }
    return next(err);
  }
};

const updateAvatarProfile = async (req, res, next) => {
  try {
    const { avatar } = req.body;

    const updatedAvatar = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    return res.status(200).json(updatedAvatar);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const error = new Error('Datos inválidos');
      error.statusCode = 400;
      return next(error);
    }
    return next(err);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  createUser,
  login,
  updateUserProfile,
  updateAvatarProfile,
};
