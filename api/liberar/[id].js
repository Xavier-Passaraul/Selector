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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  const personajeId = parseInt(id);

  if (isNaN(personajeId)) {
    return res.status(400).json({ error: 'ID inválido' });
  }

  try {
    const usuario = verificarToken(req);

    // Verificar que el personaje exista y pertenezca al usuario
    const personajeResult = await sql`
      SELECT usuario_id FROM personajes WHERE id = ${personajeId}
    `;

    if (personajeResult.length === 0) {
      return res.status(404).json({ error: 'Personaje no encontrado' });
    }

    if (personajeResult[0].usuario_id !== usuario.id) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este personaje' });
    }

    // ========================
    // LIBERAR PERSONAJE (POST)
    // ========================
    if (req.method === 'POST') {

      // Eliminar la reserva asociada
      await sql`
        DELETE FROM reservas 
        WHERE personaje_id = ${personajeId}
      `;

      // Actualizar el personaje a disponible
      await sql`
        UPDATE personajes 
        SET disponible = 1, 
            reservado_por = NULL 
        WHERE id = ${personajeId}
      `;

      return res.json({ 
        exito: true, 
        mensaje: 'Personaje liberado correctamente' 
      });
    }

    // ========================
    // ELIMINAR PERSONAJE (DELETE)
    // ========================
    if (req.method === 'DELETE') {

      // Primero eliminamos cualquier reserva que pueda quedar
      await sql`
        DELETE FROM reservas 
        WHERE personaje_id = ${personajeId}
      `;

      // Luego eliminamos el personaje
      const deleteResult = await sql`
        DELETE FROM personajes 
        WHERE id = ${personajeId}
        RETURNING id
      `;

      if (deleteResult.length === 0) {
        return res.status(404).json({ error: 'No se pudo eliminar el personaje' });
      }

      return res.json({ 
        exito: true, 
        mensaje: 'Personaje eliminado correctamente' 
      });
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('Error en [id].js:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor',
      detail: error.message 
    });
  }
}