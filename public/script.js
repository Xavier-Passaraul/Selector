// ============================================
// CONFIGURACIÓN Y ESTADO
// ============================================

const API_URL = window.location.origin + '/api';
const ENCRYPTION_KEY = 'clave_encriptacion_e2e_2026_selector';
let usuarioActual = null;
let tokenUsuario = null;
let personajeFiltrado = null;

// Funciones de encriptación E2E
const encryptE2E = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decryptE2E = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    console.error('Error desencriptando:', err);
    return null;
  }
};

// Equipamiento permitido según tipo de personaje
const equipamientoPorTipo = {
  'Guerrero': {
    'Arma de dos manos': { min: 1, max: 12, requerido: true },
    'Escudo': { min: 1, max: 12, requerido: true },
    'Collar': { min: 1, max: 12, requerido: false },
    'Anillo': { min: 1, max: 12, requerido: false },
    'Armadura': { min: 1, max: 12, requerido: false },
    'Botas': { min: 1, max: 12, requerido: false }
  },
  'Taotista de agua': {
    'Tizona': { min: 1, max: 12, requerido: true },
    'Gorro': { min: 1, max: 12, requerido: false },
    'Bolsa': { min: 1, max: 12, requerido: false },
    'Aretes': { min: 1, max: 12, requerido: false },
    'Túnica': { min: 1, max: 12, requerido: false },
    'Botas': { min: 1, max: 12, requerido: false }
  },
  'Taotista de fuego': {
    'Tizona': { min: 1, max: 12, requerido: true },
    'Gorro': { min: 1, max: 12, requerido: false },
    'Bolsa': { min: 1, max: 12, requerido: false },
    'Aretes': { min: 1, max: 12, requerido: false },
    'Túnica': { min: 1, max: 12, requerido: false },
    'Botas': { min: 1, max: 12, requerido: false }
  },
  'Troyano': {
    'Arma de una mano': { min: 1, max: 12, requerido: true },
    'Arma de una mano 2': { min: 1, max: 12, requerido: true },
    'Virola': { min: 1, max: 12, requerido: false },
    'Anillo': { min: 1, max: 12, requerido: false },
    'Collar': { min: 1, max: 12, requerido: false },
    'Armadura': { min: 1, max: 12, requerido: false },
    'Botas': { min: 1, max: 12, requerido: false }
  },
  'Arquero': {
    'Arco': { min: 1, max: 12, requerido: true },
    'Casco': { min: 1, max: 12, requerido: false },
    'Collar': { min: 1, max: 12, requerido: false },
    'Anillo': { min: 1, max: 12, requerido: false },
    'Armadura': { min: 1, max: 12, requerido: false },
    'Botas': { min: 1, max: 12, requerido: false }
  }
};

// ============================================
// FUNCIONES DE AUTENTICACIÓN
// ============================================

function toggleAuth() {
  document.getElementById('loginForm').classList.toggle('active');
  document.getElementById('registerForm').classList.toggle('active');
  limpiarFormularios();
}

function limpiarFormularios() {
  document.getElementById('loginNombre').value = '';
  document.getElementById('loginContraseña').value = '';
  document.getElementById('registerNombre').value = '';
  document.getElementById('registerContraseña').value = '';
  document.getElementById('registerConfirm').value = '';
}

async function register() {
  const nombre = document.getElementById('registerNombre').value.trim();
  const contraseña = document.getElementById('registerContraseña').value;
  const confirmar = document.getElementById('registerConfirm').value;

  if (!nombre || !contraseña || !confirmar) {
    alert('Por favor completa todos los campos');
    return;
  }

  if (contraseña !== confirmar) {
    alert('Las contraseñas no coinciden');
    return;
  }

  if (contraseña.length < 6) {
    alert('La contraseña debe tener al menos 6 caracteres');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/registro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_personaje: nombre, contraseña })
    });

    const data = await response.json();

    if (response.ok) {
      usuarioActual = nombre;
      tokenUsuario = data.token;
      localStorage.setItem('token', tokenUsuario);
      localStorage.setItem('usuario', nombre);
      irAPaginaPrincipal();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error en el registro');
  }
}

async function login() {
  const nombre = document.getElementById('loginNombre').value.trim();
  const contraseña = document.getElementById('loginContraseña').value;

  if (!nombre || !contraseña) {
    alert('Por favor ingresa usuario y contraseña');
    return;
  }

  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre_personaje: nombre, contraseña })
    });

    const data = await response.json();

    if (response.ok) {
      usuarioActual = nombre;
      tokenUsuario = data.token;
      localStorage.setItem('token', tokenUsuario);
      localStorage.setItem('usuario', nombre);
      irAPaginaPrincipal();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error en el login');
  }
}

function logout() {
  usuarioActual = null;
  tokenUsuario = null;
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  irAPaginaLogin();
}

// ============================================
// NAVEGACIÓN PÁGINAS
// ============================================

function irAPaginaPrincipal() {
  document.getElementById('authPage').classList.remove('active');
  document.getElementById('mainPage').classList.add('active');
  document.getElementById('userDisplay').textContent = `Bienvenido, ${usuarioActual}`;
  cargarMisPersonajes();
  cargarPersonajes();
}

function irAPaginaLogin() {
  document.getElementById('mainPage').classList.remove('active');
  document.getElementById('authPage').classList.add('active');
  limpiarFormularios();
  document.getElementById('loginForm').classList.add('active');
  document.getElementById('registerForm').classList.remove('active');
}

function switchTab(tabId) {
  // Ocultar todos los tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
  });

  // Mostrar tab seleccionado
  document.getElementById(tabId).classList.add('active');
  event.target.classList.add('active');
}

// ============================================
// MODAL: AGREGAR PERSONAJE
// ============================================

function openAddModal() {
  document.getElementById('addModal').classList.add('active');
  document.getElementById('formPersonaje').reset();
  document.getElementById('tipo').value = '';
  actualizarEquipamiento();
}

function closeAddModal() {
  document.getElementById('addModal').classList.remove('active');
  document.getElementById('formPersonaje').reset();
}

function actualizarEquipamiento() {
  const tipo = document.getElementById('tipo').value;
  const container = document.getElementById('equipamientoContainer');
  container.innerHTML = '';

  if (!tipo) {
    container.innerHTML = '<p style="color: var(--color-secondary); grid-column: 1/-1;">Selecciona un tipo de personaje</p>';
    return;
  }

  const equipos = equipamientoPorTipo[tipo];

  for (const [nombre, config] of Object.entries(equipos)) {
    const div = document.createElement('div');
    div.className = 'equipo-control';

    const label = document.createElement('label');
    label.textContent = `${nombre}${config.requerido ? ' *' : ''}`;
    label.style.color = config.requerido ? 'var(--color-accent)' : 'var(--color-secondary)';

    const input = document.createElement('input');
    input.type = 'number';
    input.name = `equipo_${nombre}`;
    input.min = config.min;
    input.max = config.max;
    input.placeholder = `+${config.min} a +${config.max}`;
    input.required = config.requerido;

    div.appendChild(label);
    div.appendChild(input);
    container.appendChild(div);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('formPersonaje').addEventListener('submit', agregarPersonaje);

  // Verificar si el usuario ya está logueado
  const token = localStorage.getItem('token');
  const usuario = localStorage.getItem('usuario');

  if (token && usuario) {
    tokenUsuario = token;
    usuarioActual = usuario;
    irAPaginaPrincipal();
  }
});

async function agregarPersonaje(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const tipo = document.getElementById('tipo').value;
  const evento = document.getElementById('evento').value;
  const whatsapp = document.getElementById('whatsapp').value.trim();

  if (!nombre || !tipo || !evento || !whatsapp) {
    alert('Por favor completa todos los campos requeridos');
    return;
  }

  // Recopilar equipamiento
  const equipamiento = {};
  const tipoEquipos = equipamientoPorTipo[tipo];

  for (const nombreEquipo of Object.keys(tipoEquipos)) {
    const input = document.querySelector(`input[name="equipo_${nombreEquipo}"]`);
    if (input && input.value) {
      equipamiento[nombreEquipo] = parseInt(input.value);
    } else if (tipoEquipos[nombreEquipo].requerido) {
      alert(`${nombreEquipo} es requerido`);
      return;
    }
  }

  try {
    // Encriptar WhatsApp E2E antes de enviar
    const whatsappEncriptado = encryptE2E(whatsapp);

    const response = await fetch(`${API_URL}/personajes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenUsuario}`
      },
      body: JSON.stringify({
        nombre_personaje: nombre,
        tipo,
        evento,
        whatsapp: whatsappEncriptado,
        equipamiento
      })
    });

    const data = await response.json();

    if (response.ok) {
      alert('¡Personaje creado exitosamente!');
      closeAddModal();
      cargarMisPersonajes();
      cargarPersonajes();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al crear el personaje');
  }
}

// ============================================
// CARGAR PERSONAJES
// ============================================

async function cargarMisPersonajes() {
  try {
    const response = await fetch(`${API_URL}/mis-personajes`, {
      headers: { 'Authorization': `Bearer ${tokenUsuario}` }
    });

    const personajes = await response.json();
    mostrarMisPersonajes(personajes);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function cargarPersonajes() {
  try {
    const response = await fetch(`${API_URL}/personajes`, {
      headers: { 'Authorization': `Bearer ${tokenUsuario}` }
    });

    const personajes = await response.json();
    mostrarPersonajesBusqueda(personajes);
  } catch (error) {
    console.error('Error:', error);
  }
}

function mostrarMisPersonajes(personajes) {
  const container = document.getElementById('misPersonajesList');

  if (personajes.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <h3>No tienes personajes aún</h3>
        <p>Haz clic en "Agregar Personaje" para crear tu primer personaje</p>
      </div>
    `;
    return;
  }

  container.innerHTML = personajes.map(p => crearTarjetaPersonajePropio(p)).join('');
}

function mostrarPersonajesBusqueda(personajes) {
  const container = document.getElementById('personajesList');

  if (personajes.length === 0) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <h3>No hay personajes disponibles</h3>
      </div>
    `;
    return;
  }

  container.innerHTML = personajes.map(p => crearTarjetaPersonajeBusqueda(p)).join('');

  // Agregar event listeners
  personajes.forEach(p => {
    const btnVer = document.querySelector(`[data-ver-personaje="${p.id}"]`);
    if (btnVer) {
      btnVer.addEventListener('click', () => mostrarDetallesPersonaje(p));
    }
  });
}

function crearTarjetaPersonajePropio(p) {
  const tipoBadgeClass = p.tipo.includes('Taotista de agua') ? 'agua' :
                        p.tipo.includes('Taotista de fuego') ? 'fuego' :
                        p.tipo.includes('Troyano') ? 'troyano' :
                        p.tipo.includes('Arquero') ? 'arquero' : 'guerrero';

  const statusClass = p.disponible ? 'disponible' : 'ocupado';
  const statusText = p.disponible ? '✓ Disponible' : '✗ Ocupado';

  let botones = '';
  if (p.disponible && !p.reservado_por) {
    // Personaje sin reservar aún
  } else if (!p.disponible && p.reservado_por) {
    botones = `<button class="btn-liberar" onclick="liberarPersonaje(${p.id})">Liberar Personaje</button>`;
  }

  return `
    <div class="personaje-card">
      <div class="personaje-header">
        <div class="personaje-nombre">${p.nombre_personaje}</div>
        <span class="tipo-badge ${tipoBadgeClass}">${p.tipo}</span>
      </div>

      <span class="status-badge ${statusClass}">${statusText}</span>

      <div class="evento-info">
        <p><span class="evento-nombre">${p.evento}</span></p>
        <p>⏰ ${p.hora_evento}</p>
        <p>📱 ${p.whatsapp}</p>
      </div>

      <div class="equipamiento-list">
        ${Object.entries(p.equipamiento).map(([k, v]) => 
          `<div class="equipo-item"><span class="equipo-nombre">${k}</span><span class="equipo-valor">+${v}</span></div>`
        ).join('')}
      </div>

      <div class="personaje-actions">
        <button class="btn-eliminar" onclick="eliminarPersonaje(${p.id})">Eliminar</button>
        ${botones}
      </div>
    </div>
  `;
}

function crearTarjetaPersonajeBusqueda(p) {
  const tipoBadgeClass = p.tipo.includes('Taotista de agua') ? 'agua' :
                        p.tipo.includes('Taotista de fuego') ? 'fuego' :
                        p.tipo.includes('Troyano') ? 'troyano' :
                        p.tipo.includes('Arquero') ? 'arquero' : 'guerrero';

  const statusClass = p.disponible ? 'disponible' : 'ocupado';
  const statusText = p.disponible ? '✓ Disponible' : '✗ Ocupado';

  const btnVer = p.disponible ? `
    <button class="btn-ver" data-ver-personaje="${p.id}">Ver Detalles</button>
  ` : '';

  return `
    <div class="personaje-card">
      <div class="personaje-header">
        <div class="personaje-nombre">${p.nombre_personaje}</div>
        <span class="tipo-badge ${tipoBadgeClass}">${p.tipo}</span>
      </div>

      <span class="status-badge ${statusClass}">${statusText}</span>

      <div class="evento-info">
        <p><span class="evento-nombre">${p.evento}</span></p>
        <p>⏰ ${p.hora_evento}</p>
      </div>

      <div class="creador-info">
        <p>Creador: <span class="creador-nombre">${p.creador}</span></p>
      </div>

      <div class="equipamiento-list">
        ${Object.entries(p.equipamiento).map(([k, v]) => 
          `<div class="equipo-item"><span class="equipo-nombre">${k}</span><span class="equipo-valor">+${v}</span></div>`
        ).join('')}
      </div>

      <div class="personaje-actions">
        ${btnVer}
      </div>
    </div>
  `;
}

// ============================================
// MODAL: DETALLES PERSONAJE
// ============================================

function mostrarDetallesPersonaje(p) {
  personajeFiltrado = p;
  document.getElementById('detallesNombre').textContent = p.nombre_personaje;

  const detallesBody = document.getElementById('detallesBody');
  detallesBody.innerHTML = `
    <div class="detalle-seccion">
      <h3>Información General</h3>
      <div class="detalle-item">
        <span class="detalle-label">Tipo:</span>
        <span class="detalle-valor">${p.tipo}</span>
      </div>
      <div class="detalle-item">
        <span class="detalle-label">Evento:</span>
        <span class="detalle-valor">${p.evento}</span>
      </div>
      <div class="detalle-item">
        <span class="detalle-label">Hora:</span>
        <span class="detalle-valor">${p.hora_evento}</span>
      </div>
      <div class="detalle-item">
        <span class="detalle-label">Creador:</span>
        <span class="detalle-valor">${p.creador}</span>
      </div>
    </div>

    <div class="detalle-seccion">
      <h3>Equipamiento</h3>
      ${Object.entries(p.equipamiento).map(([k, v]) => 
        `<div class="detalle-item"><span class="detalle-label">${k}:</span><span class="detalle-valor">+${v}</span></div>`
      ).join('')}
    </div>
  `;

  const detallesActions = document.getElementById('detallesActions');
  detallesActions.innerHTML = `
    <button class="btn-primary" onclick="reservarPersonaje(${p.id})">Reservar Personaje</button>
    <button class="btn-secondary" onclick="closeDetallesModal()">Cerrar</button>
  `;

  document.getElementById('detallesModal').classList.add('active');
}

function closeDetallesModal() {
  document.getElementById('detallesModal').classList.remove('active');
  personajeFiltrado = null;
}

// ============================================
// ACCIONES
// ============================================

async function reservarPersonaje(personajeId) {
  try {
    const response = await fetch(`${API_URL}/reservar/${personajeId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${tokenUsuario}` }
    });

    const data = await response.json();

    if (response.ok) {
      closeDetallesModal();
      mostrarReservaExitosa(data.personaje);
      cargarPersonajes();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al reservar personaje');
  }
}

function mostrarReservaExitosa(personaje) {
  const mensaje = `Hola ${personaje.creador} reserve ${personaje.nombre_personaje} para el evento ${personaje.evento}, podrías brindarme la cuenta y contraseña?`;
  const mensajeEncodificado = encodeURIComponent(mensaje);
  const whatsappURL = `https://wa.me/${personaje.whatsapp.replace(/\D/g, '')}?text=${mensajeEncodificado}`;

  const detallesHTML = `
    <p><strong>Personaje:</strong> ${personaje.nombre_personaje}</p>
    <p><strong>Tipo:</strong> ${personaje.tipo}</p>
    <p><strong>Evento:</strong> ${personaje.evento} - ${personaje.hora_evento}</p>
    <p><strong>Creador:</strong> ${personaje.creador}</p>
    <p><strong>WhatsApp:</strong> ${personaje.whatsapp}</p>
    <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--color-secondary);">
      <strong>Contacta al creador:</strong>
      <a href="${whatsappURL}" target="_blank" class="whatsapp-link">
        Enviar Mensaje
      </a>
    </p>
  `;

  document.getElementById('reservaDetalles').innerHTML = detallesHTML;
  document.getElementById('reservaModal').classList.add('active');
}

function closeReservaModal() {
  document.getElementById('reservaModal').classList.remove('active');
}

async function liberarPersonaje(personajeId) {
  if (!confirm('¿Estás seguro de que deseas liberar este personaje?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/liberar/${personajeId}`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${tokenUsuario}` }
    });

    const data = await response.json();

    if (response.ok) {
      alert('Personaje liberado');
      cargarMisPersonajes();
      cargarPersonajes();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al liberar personaje');
  }
}

async function eliminarPersonaje(personajeId) {
  if (!confirm('¿Estás seguro de que deseas eliminar este personaje?')) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/personajes/${personajeId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${tokenUsuario}` }
    });

    const data = await response.json();

    if (response.ok) {
      alert('Personaje eliminado');
      cargarMisPersonajes();
      cargarPersonajes();
    } else {
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error al eliminar personaje');
  }
}
