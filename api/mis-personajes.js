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
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    const usuario = verificarToken(req);

    const result = await sql`
      SELECT * FROM personajes WHERE usuario_id = ${usuario.id}
    `;

    const personajes = result.rows.map(p => ({
      ...p,
      equipamiento: JSON.parse(p.equipamiento),
      whatsapp: decryptE2E(p.whatsapp) || p.whatsapp
    }));

    res.json(personajes);
  } catch (error) {
    console.error('Error obteniendo mis personajes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}