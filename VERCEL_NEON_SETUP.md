# 🚀 Configuración para Vercel y Neon

## Requisitos Previos

1. Una cuenta en [Vercel](https://vercel.com)
2. Una cuenta en [Neon](https://neon.tech)
3. Node.js 18+
4. Git

---

## Paso 1: Configurar Base de Datos Neon

### 1.1 Crear proyecto en Neon
1. Ve a https://neon.tech
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto PostgreSQL
4. Copia la **Connection String** (URL de conexión)

### 1.2 Ejecutar script de inicialización
1. En tu máquina local, crea un archivo `.env.local`:
```bash
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=tu_clave_muy_segura_aqui
NODE_ENV=development
PORT=3000
```

2. Instala dependencias:
```bash
npm install
```

3. Ejecuta el script de inicialización:
```bash
npm run init-db
```

Esto creará las tablas en tu base de datos Neon.

---

## Paso 2: Desplegar en Vercel

### 2.1 Conectar repositorio
1. Ve a https://vercel.com
2. Clic en "New Project"
3. Selecciona tu repositorio de GitHub
4. Vercel detectará automáticamente que es un proyecto Node.js

### 2.2 Configurar variables de entorno
En la sección "Environment Variables" de Vercel, agrega:

| Variable | Valor |
|----------|-------|
| `DATABASE_URL` | Tu URL de conexión de Neon |
| `JWT_SECRET` | Una contraseña segura y única |
| `NODE_ENV` | `production` |

### 2.3 Desplegar
Haz clic en "Deploy" y espera a que termine.

---

## Paso 3: Verificar que funciona

### 3.1 Prueba de registro
```bash
curl -X POST https://tu-app.vercel.app/api/registro \
  -H "Content-Type: application/json" \
  -d '{
    "nombre_personaje": "TestUser",
    "contraseña": "password123"
  }'
```

Deberías recibir un token JWT en la respuesta.

### 3.2 Verificar base de datos
Desde el panel de Neon, consulta la tabla `usuarios`:
```sql
SELECT * FROM usuarios;
```

---

## Solución de Problemas

### Error: "Database connection failed"
- Verifica que `DATABASE_URL` sea correcta en Vercel
- Asegúrate de que Neon está activo
- Prueba la conexión localmente con `.env.local`

### Error: "Token inválido"
- Verifica que `JWT_SECRET` sea igual en desarrollo y producción
- No uses caracteres especiales en la contraseña

### Los personajes no aparecen
- Verifica que `usuario_id` en personajes sea correcto
- Comprueba que el token se envía con el header `Authorization: Bearer <token>`

### CORS errors
- Los headers CORS ya están configurados en todos los endpoints
- Si persiste, verifica la URL de tu cliente

---

## Estructura de Archivos

```
/api/
  registro.js       ← POST /api/registro
  login.js          ← POST /api/login
  mis-personajes.js ← GET /api/mis-personajes
  personajes.js     ← GET/POST /api/personajes
  reservar/[id].js  ← POST /api/reservar/:id
  liberar/[id].js   ← POST /api/liberar/:id
  personajes/[id].js ← DELETE /api/personajes/:id
/public/
  index.html        ← Interfaz del usuario
  script.js         ← Lógica del cliente
  styles.css        ← Estilos
vercel.json         ← Configuración de Vercel
.env.local          ← Variables locales (no subir a Git)
init-db.js          ← Crea tablas en Neon
```

---

## Desarrollo Local

```bash
# 1. Copia .env.example a .env.local y configura
cp .env.example .env.local

# 2. Instala dependencias
npm install

# 3. Inicia el servidor (si tienes)
npm run dev

# 4. Abre en el navegador
http://localhost:3000
```

---

## Variables de Entorno Requeridas

```env
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=tu_clave_segura
NODE_ENV=development|production
PORT=3000 (local)
```

---

## Cambios Realizados para Vercel + Neon

✅ Uso de `@neondatabase/serverless` en lugar de `@vercel/postgres`  
✅ Corrección de queries SQL para Neon  
✅ Variables de entorno usando `process.env`  
✅ Headers CORS configurados en todos los endpoints  
✅ Encriptación E2E para WhatsApp  
✅ Autenticación JWT correcta  
✅ Validaciones de entrada  
✅ Manejo de errores mejorado  

---

## Comandos Útiles

```bash
# Ver logs en Vercel
vercel logs

# Desplegar cambios
git push origin main

# Probar localmente
npm run dev
```

---

## Soporte

Si encuentras problemas:
1. Revisa los logs en Vercel Dashboard
2. Verifica la conexión a Neon
3. Comprueba que las variables de entorno estén correctas
4. Consulta la consola del navegador (F12) para errores del cliente
