const form = document.getElementById('form-mentorado');
const usuarioId = document.getElementById('usuarioId');
const listaMentorados = document.getElementById('lista-mentorados'); // Puedes renombrarlo si quieres
let mentoradoEditandoId = null;

// Cargar usuarios con rol Mentorado para el select
async function cargarUsuariosMentorados() {
  const res = await fetch('/api/usuarios/mentorados');
  const usuarios = await res.json();

  usuarioId.innerHTML = '<option value="" disabled selected>-- Seleccionar mentorado --</option>';

  usuarios.forEach(usuario => {
    const option = document.createElement('option');
    option.value = usuario._id;
    option.textContent = `${usuario.nombre} (${usuario.email})`;
    usuarioId.appendChild(option);
  });
}

// Cargar todos los mentorados y mostrarlos
async function cargarMentorados() {
  const res = await fetch('/api/mentorados');
  const mentorados = await res.json();

  listaMentorados.innerHTML = '';

  mentorados.forEach(m => {
    const div = document.createElement('div');
    div.className = 'col';

    div.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h5 class="card-title">${m.usuarioId?.nombre || 'Sin nombre'}</h5>
          <h6 class="card-subtitle mb-2 text-muted">${m.usuarioId?.email || ''}</h6>
          <p><strong>Objetivo:</strong> ${m.objetivo}</p>
          <p><strong>Horario:</strong> ${m.horario}</p>
          <p><strong>Nivel:</strong> ${m.nivel || '-'}</p>
          <button class="btn btn-primary btn-sm me-2" onclick="actualizarMentorado('${m._id}')">Actualizar</button>
          <button class="btn btn-danger btn-sm" onclick="eliminarMentorado('${m._id}')">Eliminar</button>
        </div>
      </div>
    `;
    listaMentorados.appendChild(div);
  });
}

// Función para crear mentorado (POST)
async function defaultSubmit(e) {
  e.preventDefault();

  const data = {
    usuarioId: usuarioId.value,
    objetivo: form.objetivo.value.trim(),
    horario: form.horario.value.trim(),
    nivel: form.nivel.value.trim()
  };

  const res = await fetch('/api/mentorados', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    alert('Mentorado guardado correctamente');
    form.reset();
    cargarMentorados();
  } else {
    alert('Error al guardar mentorado');
  }
}

// Función para actualizar mentorado (PUT)
async function actualizarMentorado(id) {
  const res = await fetch('/api/mentorados');
  const mentorados = await res.json();
  const mentorado = mentorados.find(m => m._id === id);
  if (!mentorado) return;

  usuarioId.value = mentorado.usuarioId._id || '';
  form.objetivo.value = mentorado.objetivo || '';
  form.horario.value = mentorado.horario || '';
  form.nivel.value = mentorado.nivel || '';

  mentoradoEditandoId = id;

  form.onsubmit = async (e) => {
    e.preventDefault();

    const data = {
      usuarioId: usuarioId.value,
      objetivo: form.objetivo.value.trim(),
      horario: form.horario.value.trim(),
      nivel: form.nivel.value.trim()
    };

    const res = await fetch(`/api/mentorados/${mentoradoEditandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (res.ok) {
      alert('Mentorado actualizado correctamente');
      form.reset();
      mentoradoEditandoId = null;
      form.onsubmit = defaultSubmit;
      cargarMentorados();
    } else {
      alert('Error al actualizar mentorado');
    }
  };
}

// Función para eliminar mentorado
async function eliminarMentorado(id) {
  if (confirm('¿Eliminar este mentorado?')) {
    const res = await fetch(`/api/mentorados/${id}`, { method: 'DELETE' });
    if (res.ok) {
      cargarMentorados();
    } else {
      alert('Error al eliminar mentorado');
    }
  }
}

// Inicialización al cargar la página
window.addEventListener('DOMContentLoaded', () => {
  cargarUsuariosMentorados();
  cargarMentorados();
  form.onsubmit = defaultSubmit;
});
