import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);
const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const { nombre_personaje, contraseña } = req.body;

    if (!nombre_personaje || !contraseña) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const result = await sql`
      SELECT id, nombre_personaje, password
      FROM usuarios
      WHERE nombre_personaje = ${nombre_personaje}
    `;

    if (result.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    const usuario = result[0];

    const ok = await bcrypt.compare(contraseña, usuario.password);

    if (!ok) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      { id: usuario.id, nombre_personaje: usuario.nombre_personaje },
      SECRET_KEY
    );

    return res.status(200).json({
      id: usuario.id,
      nombre_personaje: usuario.nombre_personaje,
      token
    });

  } catch (error) {
    console.error('LOGIN ERROR:', error);

    return res.status(500).json({
      error: 'Error interno del servidor',
      detail: error.message
    });
  }
}