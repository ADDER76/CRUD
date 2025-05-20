const form = document.getElementById('form-usuario');
const lista = document.getElementById('lista-usuarios');
const btnCancelar = document.getElementById('cancelar-edicion');

let editandoId = null;

// Cargar usuarios al inicio
window.onload = cargarUsuarios;

// Evento para crear o actualizar
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  if (editandoId) {
    const datos = Object.fromEntries(formData.entries());
    await fetch(`/api/usuarios/${editandoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    alert('✅ Usuario actualizado');
    editandoId = null;
    btnCancelar.style.display = 'none';
  } else {
    await fetch('/api/usuarios', {
      method: 'POST',
      body: formData
    });
    alert('✅ Usuario creado');
  }

  form.reset();
  cargarUsuarios();
});

// Botón cancelar edición
btnCancelar.addEventListener('click', () => {
  editandoId = null;
  form.reset();
  btnCancelar.style.display = 'none';
});

// Cargar usuarios
async function cargarUsuarios() {
  const res = await fetch('/api/usuarios');
  const usuarios = await res.json();
  lista.innerHTML = '';

  usuarios.forEach(u => {
    const div = document.createElement('div');
    div.className = 'col';

    div.innerHTML = `
      <div class="card shadow-sm">
        <div class="row g-0">
          <div class="col-md-3 d-flex flex-column align-items-center justify-content-center p-2">
            ${u.imagen ? `<img src="/uploads/${u.imagen}" class="img-fluid rounded-circle" width="80"/>` : ''}
            <strong class="mt-2">${u.nombre}</strong>
          </div>
          <div class="col-md-9">
            <div class="card-body">
              <p><strong>Email:</strong> ${u.email}</p>
              <p><strong>Rol:</strong> ${u.rol}</p>
              <div class="text-end">
                <button class="btn btn-danger btn-sm me-2" onclick="eliminarUsuario('${u._id}')">Eliminar</button>
                <button class="btn btn-warning btn-sm" onclick="editarUsuario('${u._id}')">Editar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    lista.appendChild(div);
  });
}

// Eliminar usuario
async function eliminarUsuario(id) {
  if (confirm('¿Deseas eliminar este usuario?')) {
    await fetch(`/api/usuarios/${id}`, { method: 'DELETE' });
    cargarUsuarios();
  }
}

// Editar usuario
async function editarUsuario(id) {
  const res = await fetch('/api/usuarios');
  const usuarios = await res.json();
  const usuario = usuarios.find(u => u._id === id);
  if (!usuario) return;

  form.nombre.value = usuario.nombre;
  form.email.value = usuario.email;
  form.password.value = usuario.password;
  form.rol.value = usuario.rol;
  editandoId = id;
  btnCancelar.style.display = 'inline-block';
}
