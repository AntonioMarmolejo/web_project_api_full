// //users.js
const express = require('express');
const { getUsers, getUserById, createUser, updateUserProfile, updateAvatarProfile } = require('../controllers/users');
const router = express.Router();

router.get('/', getUsers); //Obtener todos los usuarios
router.get('/:userId', getUserById);//Obtener un usuario por ID
router.post('/', createUser);//Crear un nuevo usuario
router.patch('/me', updateUserProfile);// Actuliza el nombre y la descripción del usuario
router.patch('/me/avatar', updateAvatarProfile);// Actualiza el avatar del usuario

module.exports = router;


