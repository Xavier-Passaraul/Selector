# 📝 Notas de Desarrollo

## Próximas Mejoras (Roadmap)

### Fase 2: Mejoras Visuales
- [ ] Obtener ubicación automática del usuario para mapear eventos
- [ ] Sistema de calificaciones/comentarios entre usuarios
- [ ] Historial de reservas anteriores
- [ ] Sistema de notificaciones en tiempo real (Socket.io)
- [ ] Imágenes de portada para personajes

### Fase 3: Social Features
- [ ] Sistema de chat directo entre usuarios
- [ ] Grupos/Gremios para eventos
- [ ] Sistema de amigos/contactos favoritos
- [ ] Feed de actividad reciente

### Fase 4: Gamificación
- [ ] Sistema de logros/medallas
- [ ] Puntos de reputación
- [ ] Ranking de personajes más reservados
- [ ] Misiones de eventos

### Fase 5: Admin Panel
- [ ] Dashboard de administración
- [ ] Moderar usuarios/personajes
- [ ] Estadísticas de uso
- [ ] Gestionar eventos desde panel

---

## Cambios Técnicos Recomendados

### 1. Agregar Variables de Entorno
```javascript
// Cambiar en server.js:
const SECRET_KEY = process.env.JWT_SECRET || 'default_key';
const PORT = process.env.PORT || 3000;
const DB_PATH = process.env.DB_PATH || './db/database.db';
```

### 2. Usar .env
```bash
# En .env:
JWT_SECRET=tu_clave_muy_segura_2026
PORT=3000
DB_PATH=./db/database.db
NODE_ENV=development
```

### 3. Agregar HTTPS en Producción
```javascript
// Para producción, agregar certificados SSL
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('path/to/key.pem'),
  cert: fs.readFileSync('path/to/cert.pem')
};

https.createServer(options, app).listen(443);
```

### 4. Implementar Logging
```bash
npm install winston morgan
```
```javascript
const winston = require('winston');
const morgan = require('morgan');

app.use(morgan('combined')); // Log de HTTP
const logger = winston.createLogger({...}); // Log personalizado
```

### 5. Agregar Validación de Entrada
```bash
npm install joi
```
```javascript
const schema = Joi.object({
  nombre_personaje: Joi.string().alphanum().min(3).max(30).required(),
  contraseña: Joi.string().min(6).max(30).required()
});
```

### 6. Implementar Rate Limiting
```bash
npm install express-rate-limit
```
```javascript
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);
```

---

## Testing Recomendado

### Instalar Jest
```bash
npm install --save-dev jest supertest
```

### Tests Básicos a Implementar
```javascript
// tests/api.test.js

describe('Autenticación', () => {
  test('POST /registro debe crear usuario', async () => {
    // Test
  });
  
  test('POST /login debe retornar token', async () => {
    // Test
  });
});

describe('Personajes', () => {
  test('POST /personajes debe crear personaje', async () => {
    // Test
  });
  
  test('GET /personajes debe listar', async () => {
    // Test
  });
  
  test('POST /reservar debe marcar como ocupado', async () => {
    // Test
  });
});
```

---

## Deployment (Producción)

### Opción 1: Heroku
```bash
# Crear Procfile
echo "web: npm start" > Procfile

# Deploy
git push heroku main
```

### Opción 2: Vercel
```bash
npm install -g vercel
vercel
# (No recomendado para Node.js backend)
```

### Opción 3: AWS Lambda + RDS
```javascript
// Convertir a Lambda handler
exports.handler = async (event) => {
  // Adaptar para Lambda
};
```

### Opción 4: VPS (Recomendado)
1. Alquilar VPS (DigitalOcean, Linode, AWS EC2)
2. SSH al servidor
3. `git clone` repo
4. `npm install`
5. Usar PM2 para mantener corriendo:
```bash
npm install -g pm2
pm2 start server.js --name "selector"
pm2 startup
pm2 save
```
6. Configurar Nginx como reverse proxy

---

## Optimizaciones de Performance

### 1. Caché de Datos
```javascript
// Agregar Redis
const redis = require('redis');
const client = redis.createClient();

app.get('/personajes', verificarToken, async (req, res) => {
  const cached = await client.get('personajes');
  if (cached) return res.json(JSON.parse(cached));
  
  // Obtener de BD
  const personajes = await obtenerPersonajes();
  
  // Guardar en caché por 5 minutos
  client.setex('personajes', 300, JSON.stringify(personajes));
  res.json(personajes);
});
```

### 2. Paginación
```javascript
// GET /personajes?page=1&limit=10
app.get('/personajes', verificarToken, (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const offset = (page - 1) * limit;
  
  db.all(
    `SELECT * FROM personajes LIMIT ? OFFSET ?`,
    [limit, offset],
    (err, personajes) => { ... }
  );
});
```

### 3. Compresión
```bash
npm install compression
```
```javascript
const compression = require('compression');
app.use(compression());
```

### 4. Minificar CSS/JS
```bash
npm install --save-dev terser clean-css-cli
```

---

## Bugs Conocidos / A Revisar

- [ ] Si el usuario cierra sesión mientras está en modal, puede haber inconsistencia
- [ ] No hay validación de duplicados de nombre de personaje por usuario
- [ ] El equipamiento JSON podría tener problemas si contiene caracteres especiales
- [ ] No hay limpieza automática de sesiones expiradas
- [ ] Falta paginación para usuarios con 200+ personajes

---

## Características Futuras Específicas

### Chat en Tiempo Real
```bash
npm install socket.io
```
```javascript
const io = require('socket.io')(server, {
  cors: { origin: "*" }
});

io.on('connection', (socket) => {
  socket.on('mensaje', (data) => {
    // Enviar mensaje
  });
});
```

### Notificaciones Push
```bash
npm install web-push
```

### Sistema de Pago (Suscripción Premium)
```bash
npm install stripe
```

### Exportar Datos
```javascript
// Exportar personajes a CSV
const json2csv = require('json2csv').parse;
const csv = json2csv(personajes);
```

---

## Configuración de CI/CD

### GitHub Actions
```yaml
name: Tests
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test
```

---

## Notas de Seguridad Adicional

1. **Cambiar SECRET_KEY** antes de producción
2. **Agregar HTTPS** en producción
3. **Implementar CSRF tokens** para formularios
4. **Agregar rate limiting** para login
5. **Validar tamaños** de uploads
6. **Sanitizar inputs** con DOMPurify
7. **Usar HTTPS** para todas las conexiones
8. **Implementar 2FA** (Two-Factor Authentication)
9. **Usar secrets manager** para credenciales
10. **Monitorear** acceso a BD

---

## Comandos Útiles de Desarrollo

```bash
# Comprobar sintaxis
node -c server.js

# Ejecutar con modo watch
npm install -g nodemon
nodemon server.js

# Profiling
node --prof server.js
node --prof-process isolate-*.log > profile.txt

# Debugging
node --inspect server.js
# Abre chrome://inspect

# Tests
npm test

# Linting
npm install -g eslint
eslint server.js

# Formattear código
npm install -g prettier
prettier --write server.js
```

---

## Documentación a Mantener

- [ ] CHANGELOG.md - Versiones y cambios
- [ ] CONTRIBUTING.md - Guía para contribuidores
- [ ] SECURITY.md - Política de seguridad
- [ ] CODE_OF_CONDUCT.md - Conducta esperada
- [ ] DEPLOYMENT.md - Instrucciones de deploy

---

## Contacto y Soporte

Para reportar bugs o sugerir mejoras:
1. Crear issue con descripción clara
2. Incluir pasos para reproducir
3. Incluir versión de Node.js y SO
4. Adjuntar logs if available

---

**Última actualización:** April 14, 2026
**Versión Actual:** 1.0.0
**Estado:** Beta - Listo para uso pero con mejoras pendientes
