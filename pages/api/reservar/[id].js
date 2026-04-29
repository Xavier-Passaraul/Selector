const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const SECRET_KEY = 'tu_clave_secreta_segura_2026';
const ENCRYPTION_KEY = 'clave_encriptacion_e2e_2026_selector';

const decryptE2E = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    console.error('Error desencriptando:', err);
    return null;
  }
};

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
    if (personaje.disponible === 0) {
      return res.status(400).json({ error: 'Personaje ya está reservado' });
    }

    await sql`
      UPDATE personajes SET disponible = 0, reservado_por = ${usuario.id} WHERE id = ${id}
    `;

    await sql`
      INSERT INTO reservas (personaje_id, usuario_reserva_id) VALUES (${id}, ${usuario.id})
    `;

    const creadorResult = await sql`
      SELECT nombre_personaje FROM usuarios WHERE id = ${personaje.usuario_id}
    `;

    res.json({
      exito: true,
      mensaje: 'Personaje reservado',
      personaje: {
        ...personaje,
        equipamiento: JSON.parse(personaje.equipamiento),
        creador: creadorResult.rows[0].nombre_personaje,
        whatsapp: decryptE2E(personaje.whatsapp) || personaje.whatsapp
      }
    });
  } catch (error) {
    console.error('Error reservando personaje:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}