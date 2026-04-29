import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);
const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta_segura_2026';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { nombre_personaje, contraseña } = req.body;

  if (!nombre_personaje || !contraseña) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    const contraseña_hash = await bcrypt.hash(contraseña, 10);

    const result = await sql`
      INSERT INTO usuarios (nombre_personaje, contraseña)
      VALUES (${nombre_personaje}, ${contraseña_hash})
      RETURNING id, nombre_personaje
    `;

    const usuario = result[0];

    const token = jwt.sign(
      { id: usuario.id, nombre_personaje: usuario.nombre_personaje },
      SECRET_KEY
    );

    return res.status(201).json({
      id: usuario.id,
      nombre_personaje: usuario.nombre_personaje,
      token
    });

  } catch (error) {
    if (error.code === '23505' || error.message.includes('duplicate key')) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    console.error('REGISTRO ERROR:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}