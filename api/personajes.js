import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const sql = neon(process.env.DATABASE_URL);

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret';
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {

    // =========================
    // POST - CREAR PERSONAJE
    // =========================
    if (req.method === 'POST') {
      const usuario = verificarToken(req);
      const { nombre_personaje, tipo, evento, whatsapp, equipamiento } = req.body;

      const countResult = await sql`
        SELECT COUNT(*) FROM personajes WHERE usuario_id = ${usuario.id}
      `;

      const count = Number(countResult[0].count);

      if (count >= 200) {
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
        INSERT INTO personajes (
          usuario_id,
          nombre_personaje,
          tipo,
          evento,
          hora_evento,
          whatsapp,
          equipamiento
        )
        VALUES (
          ${usuario.id},
          ${nombre_personaje},
          ${tipo},
          ${evento},
          ${hora_evento},
          ${whatsappEncriptado},
          ${JSON.stringify(equipamiento)}
        )
        RETURNING id
      `;

      return res.status(201).json({
        id: result[0].id,
        mensaje: 'Personaje creado'
      });
    }

    // =========================
    // GET - LISTAR PERSONAJES
    // =========================
    if (req.method === 'GET') {
      const usuario = verificarToken(req);

      const result = await sql`
        SELECT p.*, u.nombre_personaje as creador
        FROM personajes p
        JOIN usuarios u ON p.usuario_id = u.id
        WHERE p.disponible = 1 OR p.usuario_id = ${usuario.id}
      `;

      const personajes = result.map(p => ({
        ...p,
        equipamiento: p.equipamiento ? JSON.parse(p.equipamiento) : []
      }));

      return res.status(200).json(personajes);
    }

    return res.status(405).json({ error: 'Método no permitido' });

  } catch (error) {
    console.error('Error personajes:', error);

    return res.status(500).json({
      error: 'Error interno del servidor',
      detail: error.message
    });
  }
}