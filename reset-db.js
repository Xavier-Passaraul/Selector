import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function resetDB() {
  try {
    console.log('🗑️ Eliminando tablas existentes...');

    // Eliminar tablas en orden inverso (por dependencias)
    await sql`DROP TABLE IF EXISTS reservas CASCADE`;
    await sql`DROP TABLE IF EXISTS personajes CASCADE`;
    await sql`DROP TABLE IF EXISTS usuarios CASCADE`;

    console.log('✅ Tablas eliminadas');

    console.log('🔨 Creando tablas nuevas...');

    // Crear tabla usuarios
    await sql`
      CREATE TABLE usuarios (
        id SERIAL PRIMARY KEY,
        nombre_personaje TEXT UNIQUE NOT NULL,
        contraseña TEXT NOT NULL,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Crear tabla personajes
    await sql`
      CREATE TABLE personajes (
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

    // Crear tabla reservas
    await sql`
      CREATE TABLE reservas (
        id SERIAL PRIMARY KEY,
        personaje_id INTEGER NOT NULL REFERENCES personajes(id),
        usuario_reserva_id INTEGER NOT NULL REFERENCES usuarios(id),
        fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log('✅ Tablas creadas exitosamente con esquema correcto');

  } catch (error) {
    console.error('❌ Error reseteando BD:', error);
  }
}

resetDB();