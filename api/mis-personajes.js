import { neon } from '@neondatabase/serverless';
import jwt from 'jsonwebtoken';
import CryptoJS from 'crypto-js';

const sql = neon(process.env.DATABASE_URL);

const SECRET_KEY = process.env.JWT_SECRET || 'dev_secret';
const ENCRYPTION_KEY = 'clave_encriptacion_e2e_2026_selector';

const decryptE2E = (encryptedData) => {
  try {
    if (!encryptedData) return null;

    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    return decrypted ? JSON.parse(decrypted) : null;
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
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Método no permitido' });
    }

    const usuario = verificarToken(req);

    const result = await sql`
      SELECT * FROM personajes WHERE usuario_id = ${usuario.id}
    `;

    const personajes = result.map(p => ({
      ...p,
      equipamiento: p.equipamiento ? JSON.parse(p.equipamiento) : [],
      whatsapp: decryptE2E(p.whatsapp) || p.whatsapp
    }));

    return res.status(200).json(personajes);

  } catch (error) {
    console.error('Error obteniendo mis personajes:', error);

    return res.status(500).json({
      error: 'Error interno del servidor',
      detail: error.message
    });
  }
}