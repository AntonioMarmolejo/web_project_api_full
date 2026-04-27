const mongoose = require('mongoose');
const urlRegex = /^(https?:\/\/)(www\.)?[a-zA-Z0-9.-]+\.[a-z]{2,}\/?.*$/;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return urlRegex.test(v);
      },
      message: 'El enlace del Avatar no es válido'
    },
  },
});

const User = mongoose.model('user', userSchema);

module.exports = User;
