const mongoose = require('mongoose');

const mentoriaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  objetivo: String,
  horario: String,
  nivel: String
});

module.exports = mongoose.model('Mentorado', mentoriaSchema);
