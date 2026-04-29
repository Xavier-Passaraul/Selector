import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';

const sql = neon(process.env.DATABASE_URL);
const SECRET_KEY = process.env.JWT_SECRET || 'tu_clave_secreta_segura_2026';

const verificarToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No autorizado');
  return jwt.verify(token, SECRET_KEY);
};

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { id } = req.query;

  try {
    const usuario = verificarToken(req);

    const personajeResult = await sql`
      SELECT usuario_id FROM personajes WHERE id = ${id}
    `;
    if (personajeResult.length === 0 || personajeResult[0].usuario_id !== usuario.id) {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await sql`
      DELETE FROM personajes WHERE id = ${id}
    `;

    res.json({ exito: true });
  } catch (error) {
    console.error('Error eliminando personaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}