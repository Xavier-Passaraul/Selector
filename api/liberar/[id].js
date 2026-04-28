const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'tu_clave_secreta_segura_2026';

const verificarToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No autorizado');
  return jwt.verify(token, SECRET_KEY);
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { id } = req.query;

  try {
    const usuario = verificarToken(req);

    const personajeResult = await sql`
      SELECT * FROM personajes WHERE id = ${id}
    `;
    if (personajeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Personaje no encontrado' });
    }

    const personaje = personajeResult.rows[0];
    if (personaje.usuario_id !== usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    await sql`
      UPDATE personajes SET disponible = 1, reservado_por = NULL WHERE id = ${id}
    `;

    res.json({ exito: true, mensaje: 'Personaje liberado' });
  } catch (error) {
    console.error('Error liberando personaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}