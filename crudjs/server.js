const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');

const Usuario = require('./models/Usuario');
const Mentor = require('./models/Mentor');
const Mentorado = require('./models/Mentorado');

const app = express();
const PORT = 3000;

// Multer para subir imágenes (solo para Usuarios)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static('uploads'));

// Conexión a MongoDB en base de datos "Mentorias"
mongoose.connect('mongodb://localhost:27017/Mentorias', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Conectado a MongoDB - Mentorías'))
  .catch(err => console.error('❌ Error al conectar:', err));

// --- RUTAS PARA USUARIOS ---

// Obtener usuarios, opcionalmente filtrando por rol
app.get('/api/usuarios', async (req, res) => {
  try {
    const filtro = {};
    if (req.query.rol) {
      filtro.rol = req.query.rol;
    }
    const usuarios = await Usuario.find(filtro);
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener solo mentores
app.get('/api/usuarios/mentores', async (req, res) => {
  try {
    const mentores = await Usuario.find({ rol: 'Mentor' });
    res.json(mentores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios mentores' });
  }
});

// Obtener solo mentorados
app.get('/api/usuarios/mentorados', async (req, res) => {
  try {
    const mentorados = await Usuario.find({ rol: 'Mentorado' });
    res.json(mentorados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios mentorados' });
  }
});

// Crear usuario
app.post('/api/usuarios', upload.single('avatar'), async (req, res) => {
  try {
    const nuevoUsuario = new Usuario({
      nombre: req.body.nombre,
      email: req.body.email,
      password: req.body.password,
      rol: req.body.rol,
      imagen: req.file ? req.file.filename : null,
    });
    const guardado = await nuevoUsuario.save();
    res.json(guardado);
  } catch (error) {
    console.error('Error al guardar usuario:', error);
    res.status(500).json({ error: 'Error al guardar usuario' });
  }
});

// Actualizar usuario
app.put('/api/usuarios/:id', async (req, res) => {
  try {
    const actualizado = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    await Usuario.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// --- RUTAS PARA MENTORES ---

app.get('/api/mentores', async (req, res) => {
  try {
    const mentores = await Mentor.find().populate('usuarioId');
    res.json(mentores);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mentores' });
  }
});

app.post('/api/mentores', async (req, res) => {
  try {
    const nuevoMentor = new Mentor({
      usuarioId: req.body.usuarioId,
      especialidad: req.body.especialidad,
      horario: req.body.horario,
      bio: req.body.bio,
    });
    const guardado = await nuevoMentor.save();
    res.json(guardado);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar mentor' });
  }
});

app.put('/api/mentores/:id', async (req, res) => {
  try {
    const actualizado = await Mentor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar mentor' });
  }
});

app.delete('/api/mentores/:id', async (req, res) => {
  try {
    await Mentor.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Mentor eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar mentor' });
  }
});

// --- RUTAS PARA MENTORADOS ---

app.get('/api/mentorados', async (req, res) => {
  try {
    const mentorados = await Mentorado.find().populate('usuarioId');
    res.json(mentorados);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener mentorados' });
  }
});

app.post('/api/mentorados', async (req, res) => {
  try {
    const nuevoMentorado = new Mentorado({
      usuarioId: req.body.usuarioId,
      objetivo: req.body.objetivo,
      horario: req.body.horario,
      nivel: req.body.nivel,
    });
    const guardado = await nuevoMentorado.save();
    res.json(guardado);
  } catch (error) {
    res.status(500).json({ error: 'Error al guardar mentorado' });
  }
});

app.put('/api/mentorados/:id', async (req, res) => {
  try {
    const actualizado = await Mentorado.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar mentorado' });
  }
});

app.delete('/api/mentorados/:id', async (req, res) => {
  try {
    await Mentorado.findByIdAndDelete(req.params.id);
    res.json({ mensaje: 'Mentorado eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar mentorado' });
  }
});

// --- INICIAR SERVIDOR ---
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
