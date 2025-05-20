const form = document.getElementById('form-mentor');
const usuarioId = document.getElementById('usuarioId');
const listaMentores = document.getElementById('lista-mentores');
let mentorEditandoId = null;

// Cargar usuarios con rol Mentor para el select
async function cargarUsuariosMentores() {
  const res = await fetch('/api/usuarios/mentores');
  const usuarios = await res.json();

  usuarioId.innerHTML = '<option value="" disabled selected>-- Seleccionar mentor --</option>';

  usuarios.forEach(usuario => {
    const option = document.createElement('option');
    option.value = usuario._id;
    option.textContent = `${usuario.nombre} (${usuario.email})`;
    usuarioId.appendChild(option);
  });
}

// Cargar todos los mentores y mostrarlos
async function cargarMentores() {
  const res = await fetch('/api/mentores');
  const mentores = await res.json();

  listaMentores.innerHTML = '';

  mentores.forEach(m => {
    const div = document.createElement('div');
    div.className = 'col';

    div.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${m.usuarioId?.nombre || 'Sin mentor'}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${m.usuarioId?.email || ''}</h6>
          <p><strong>Especialidad:</strong> ${m.especialidad}</p>
          <p><strong>Horario:</strong> ${m.horario}</p>
          <p><strong>Bio:</strong> ${m.bio || '-'}</p>
          <button class="btn btn-primary btn-sm me-2" onclick="actualizarMentor('${m._id}')">Actualizar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarMentor('${m._id}')">Eliminar</button>
        </div>
      </div>
    `;
    listaMentores.appendChild(div);
  });
}

// Función para crear mentor (POST)
async function defaultSubmit(e) {
  e.preventDefault();

  const data = {
    usuarioId: usuarioId.value,
    especialidad: form.especialidad.value.trim(),
    horario: form.horario.value.trim(),
    bio: form.bio.value.trim()
  };

  const res = await fetch('/api/mentores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert('Mentor guardado correctamente');
    form.reset();
    cargarMentores();
  } else {
    alert('Error al guardar mentor');
  }
}

// Función para actualizar mentor (PUT)
async function actualizarMentor(id) {
  const res = await fetch('/api/mentores');
  const mentores = await res.json();
  const mentor = mentores.find(m => m._id === id);
  if (!mentor) return;

  // Llenar formulario con datos del mentor
  usuarioId.value = mentor.usuarioId._id || '';
  form.especialidad.value = mentor.especialidad || '';
  form.horario.value = mentor.horario || '';
  form.bio.value = mentor.bio || '';

  mentorEditandoId = id;

  // Cambiar el submit para que actualice en vez de crear
  form.onsubmit = async (e) => {
    e.preventDefault();

    const data = {
      usuarioId: usuarioId.value,
      especialidad: form.especialidad.value.trim(),
      horario: form.horario.value.trim(),
      bio: form.bio.value.trim()
    };

    const res = await fetch(`/api/mentores/${mentorEditandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert('Mentor actualizado correctamente');
      form.reset();
      mentorEditandoId = null;
      form.onsubmit = defaultSubmit; // Volver a modo crear
      cargarMentores();
    } else {
      alert('Error al actualizar mentor');
    }
  };
}

// Función para eliminar mentor (DELETE)
async function eliminarMentor(id) {
  if (confirm('¿Eliminar este mentor?')) {
    const res = await fetch(`/api/mentores/${id}`, { method: 'DELETE' });
    if (res.ok) {
      cargarMentores();
    } else {
      alert('Error al eliminar mentor');
    }
  }
}

// Inicialización al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  cargarUsuariosMentores();
  cargarMentores();
  form.onsubmit = defaultSubmit; // Modo crear por defecto
});
