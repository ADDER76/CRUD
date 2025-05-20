const mongoose = require('mongoose');

const mentoriaSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  especialidad: String,
  horario: String,
  bio: String
});

module.exports = mongoose.model('Mentor', mentoriaSchema);
