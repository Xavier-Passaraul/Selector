import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nombre_personaje TEXT UNIQUE NOT NULL,
        contraseña TEXT NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS personajes (
        id SERIAL PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id),
        nombre_personaje TEXT NOT NULL,
        tipo TEXT NOT NULL,
        evento TEXT NOT NULL,
        hora_evento TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        equipamiento TEXT NOT NULL,
        disponible INTEGER DEFAULT 1,
        reservado_por INTEGER REFERENCES usuarios(id),
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reservas (
        id SERIAL PRIMARY KEY,
        personaje_id INTEGER NOT NULL REFERENCES personajes(id),
        usuario_reserva_id INTEGER NOT NULL REFERENCES usuarios(id),
        fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('Tablas creadas exitosamente');
  } catch (error) {
    console.error('Error creando tablas:', error);
  }
}

initDB();