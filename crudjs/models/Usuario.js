const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  rol: String,
  imagen: String 
});

module.exports = mongoose.model('Usuario', usuarioSchema);
