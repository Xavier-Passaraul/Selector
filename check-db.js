import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function checkDB() {
  try {
    console.log('🔍 Verificando conexión a la base de datos...');

    // Verificar tablas existentes
    const tablesResult = await sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log('📋 Tablas existentes:', tablesResult.map(t => t.table_name));

    // Verificar estructura de tabla usuarios
    if (tablesResult.some(t => t.table_name === 'usuarios')) {
      console.log('✅ Tabla usuarios existe');

      const columnsResult = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'usuarios'
        ORDER BY ordinal_position;
      `;

      console.log('📊 Columnas de usuarios:', columnsResult);

      // Verificar si hay datos
      const countResult = await sql`SELECT COUNT(*) FROM usuarios`;
      console.log('👥 Usuarios registrados:', countResult[0].count);

    } else {
      console.log('❌ Tabla usuarios NO existe');
    }

    // Verificar estructura de tabla personajes
    if (tablesResult.some(t => t.table_name === 'personajes')) {
      console.log('✅ Tabla personajes existe');

      const columnsResult = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'personajes'
        ORDER BY ordinal_position;
      `;

      console.log('📊 Columnas de personajes:', columnsResult);

    } else {
      console.log('❌ Tabla personajes NO existe');
    }

  } catch (error) {
    console.error('❌ Error verificando BD:', error);
  }
}

checkDB();