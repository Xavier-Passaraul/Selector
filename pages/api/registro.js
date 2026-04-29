const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'tu_clave_secreta_segura_2026';

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre_personaje, contraseña } = req.body;

  if (!nombre_personaje || !contraseña) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    console.log('Intentando registrar usuario:', nombre_personaje);
    const contraseña_hash = bcrypt.hashSync(contraseña, 10);

    const result = await sql`
      INSERT INTO usuarios (nombre_personaje, contraseña)
      VALUES (${nombre_personaje}, ${contraseña_hash})
      RETURNING id, nombre_personaje
    `;

    const usuario = result.rows[0];
    const token = jwt.sign({ id: usuario.id, nombre_personaje: usuario.nombre_personaje }, SECRET_KEY);

    res.status(201).json({ id: usuario.id, nombre_personaje: usuario.nombre_personaje, token });
  } catch (error) {
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'El usuario ya existe' });
    } else {
      console.error('Error en registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}