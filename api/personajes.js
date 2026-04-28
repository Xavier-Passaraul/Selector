const { sql } = require('@vercel/postgres');
const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const SECRET_KEY = 'tu_clave_secreta_segura_2026';
const ENCRYPTION_KEY = 'clave_encriptacion_e2e_2026_selector';

const encryptE2E = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const verificarToken = (req) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) throw new Error('No autorizado');
  return jwt.verify(token, SECRET_KEY);
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const usuario = verificarToken(req);
      const { nombre_personaje, tipo, evento, whatsapp, equipamiento } = req.body;

      // Validar límite de 200 personajes
      const countResult = await sql`
        SELECT COUNT(*) as count FROM personajes WHERE usuario_id = ${usuario.id}
      `;
      if (countResult.rows[0].count >= 200) {
        return res.status(400).json({ error: 'Límite de 200 personajes alcanzado' });
      }

      const horas = {
        'Pulpo': Math.random() < 0.5 ? '20:30' : '23:30',
        'Reina divina': Math.random() < 0.5 ? '20:30' : '23:30',
        'City War Lunes': '21:30',
        'City War Jueves': '21:30',
        'Bandera': '21:00',
        'GW': '16:00-18:00'
      };

      const hora_evento = horas[evento] || '';
      const whatsappEncriptado = encryptE2E(whatsapp);

      const result = await sql`
        INSERT INTO personajes (usuario_id, nombre_personaje, tipo, evento, hora_evento, whatsapp, equipamiento)
        VALUES (${usuario.id}, ${nombre_personaje}, ${tipo}, ${evento}, ${hora_evento}, ${whatsappEncriptado}, ${JSON.stringify(equipamiento)})
        RETURNING id
      `;

      res.status(201).json({ id: result.rows[0].id, mensaje: 'Personaje creado' });
    } catch (error) {
      console.error('Error creando personaje:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else if (req.method === 'GET') {
    try {
      const usuario = verificarToken(req);

      const result = await sql`
        SELECT p.*, u.nombre_personaje as creador FROM personajes p
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.disponible = 1 OR p.usuario_id = ${usuario.id}
      `;

      const personajes = result.rows.map(p => ({
        ...p,
        equipamiento: JSON.parse(p.equipamiento)
      }));

      res.json(personajes);
    } catch (error) {
      console.error('Error obteniendo personajes:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  } else {
    res.status(405).json({ error: 'Método no permitido' });
  }
}