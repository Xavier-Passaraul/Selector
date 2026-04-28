const { sql } = require('@vercel/postgres');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'tu_clave_secreta_segura_2026';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre_personaje, contraseña } = req.body;

  try {
    const result = await sql`
      SELECT id, nombre_personaje, contraseña FROM usuarios WHERE nombre_personaje = ${nombre_personaje}
    `;

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result.rows[0];

    if (!bcrypt.compareSync(contraseña, usuario.contraseña)) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign({ id: usuario.id, nombre_personaje: usuario.nombre_personaje }, SECRET_KEY);
    res.json({ id: usuario.id, nombre_personaje: usuario.nombre_personaje, token });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}