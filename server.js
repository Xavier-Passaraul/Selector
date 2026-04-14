const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const CryptoJS = require('crypto-js');

const app = express();
const SECRET_KEY = 'tu_clave_secreta_segura_2026';
const ENCRYPTION_KEY = 'clave_encriptacion_e2e_2026_selector';

// Funciones de encriptación E2E
const encryptE2E = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decryptE2E = (encryptedData) => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    console.error('Error desencriptando:', err);
    return null;
  }
};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Base de datos
const db = new sqlite3.Database('./db/database.db', (err) => {
  if (err) console.error('Error con BD:', err);
  else console.log('Conectado a SQLite');
});

// Crear tablas
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_personaje TEXT UNIQUE NOT NULL,
    contraseña TEXT NOT NULL,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS personajes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    nombre_personaje TEXT NOT NULL,
    tipo TEXT NOT NULL,
    evento TEXT NOT NULL,
    hora_evento TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    equipamiento TEXT NOT NULL,
    disponible INTEGER DEFAULT 1,
    reservado_por INTEGER,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY(reservado_por) REFERENCES usuarios(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    personaje_id INTEGER NOT NULL,
    usuario_reserva_id INTEGER NOT NULL,
    fecha_reserva DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(personaje_id) REFERENCES personajes(id),
    FOREIGN KEY(usuario_reserva_id) REFERENCES usuarios(id)
  )`);
});

// ============= AUTENTICACIÓN =============

// Registro
app.post('/api/registro', (req, res) => {
  const { nombre_personaje, contraseña } = req.body;

  if (!nombre_personaje || !contraseña) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const contraseña_hash = bcrypt.hashSync(contraseña, 10);

  db.run(
    `INSERT INTO usuarios (nombre_personaje, contraseña) VALUES (?, ?)`,
    [nombre_personaje, contraseña_hash],
    function(err) {
      if (err) {
        return res.status(400).json({ error: 'El usuario ya existe' });
      }
      const token = jwt.sign({ id: this.lastID, nombre_personaje }, SECRET_KEY);
      res.status(201).json({ id: this.lastID, nombre_personaje, token });
    }
  );
});

// Login
app.post('/api/login', (req, res) => {
  const { nombre_personaje, contraseña } = req.body;

  db.get(
    `SELECT * FROM usuarios WHERE nombre_personaje = ?`,
    [nombre_personaje],
    (err, usuario) => {
      if (err || !usuario) {
        return res.status(401).json({ error: 'Usuario no encontrado' });
      }

      if (!bcrypt.compareSync(contraseña, usuario.contraseña)) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      const token = jwt.sign({ id: usuario.id, nombre_personaje }, SECRET_KEY);
      res.json({ id: usuario.id, nombre_personaje, token });
    }
  );
});

// Middleware de autenticación
const verificarToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No autorizado' });

  try {
    req.usuario = jwt.verify(token, SECRET_KEY);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// ============= PERSONAJES =============

// Agregar personaje
app.post('/api/personajes', verificarToken, (req, res) => {
  const { nombre_personaje, tipo, evento, whatsapp, equipamiento } = req.body;

  // Validar límite de 200 personajes
  db.get(
    `SELECT COUNT(*) as count FROM personajes WHERE usuario_id = ?`,
    [req.usuario.id],
    (err, row) => {
      if (row.count >= 200) {
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
      
      // Encriptar WhatsApp E2E
      const whatsappEncriptado = encryptE2E(whatsapp);

      db.run(
        `INSERT INTO personajes (usuario_id, nombre_personaje, tipo, evento, hora_evento, whatsapp, equipamiento)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [req.usuario.id, nombre_personaje, tipo, evento, hora_evento, whatsappEncriptado, JSON.stringify(equipamiento)],
        function(err) {
          if (err) {
            return res.status(400).json({ error: 'Error al crear personaje' });
          }
          res.status(201).json({ id: this.lastID, mensaje: 'Personaje creado' });
        }
      );
    }
  );
});

// Obtener personajes del usuario
app.get('/api/mis-personajes', verificarToken, (req, res) => {
  db.all(
    `SELECT * FROM personajes WHERE usuario_id = ?`,
    [req.usuario.id],
    (err, personajes) => {
      if (err) return res.status(500).json({ error: 'Error en BD' });
      
      personajes = personajes.map(p => ({
        ...p,
        equipamiento: JSON.parse(p.equipamiento),
        whatsapp: decryptE2E(p.whatsapp) || p.whatsapp
      }));
      
      res.json(personajes);
    }
  );
});

// Obtener todos los personajes disponibles
app.get('/api/personajes', verificarToken, (req, res) => {
  db.all(
    `SELECT p.*, u.nombre_personaje as creador FROM personajes p
     JOIN usuarios u ON p.usuario_id = u.id
     WHERE p.disponible = 1 OR p.usuario_id = ?`,
    [req.usuario.id],
    (err, personajes) => {
      if (err) return res.status(500).json({ error: 'Error en BD' });
      
      personajes = personajes.map(p => ({
        ...p,
        equipamiento: JSON.parse(p.equipamiento),
        whatsapp: decryptE2E(p.whatsapp) || p.whatsapp
      }));
      
      res.json(personajes);
    }
  );
});

// Reservar personaje
app.post('/api/reservar/:id', verificarToken, (req, res) => {
  db.get(
    `SELECT * FROM personajes WHERE id = ?`,
    [req.params.id],
    (err, personaje) => {
      if (err || !personaje) {
        return res.status(404).json({ error: 'Personaje no encontrado' });
      }

      if (personaje.disponible === 0) {
        return res.status(400).json({ error: 'Personaje ya está reservado' });
      }

      // Marcar como ocupado y guardar quién lo reservó
      db.run(
        `UPDATE personajes SET disponible = 0, reservado_por = ? WHERE id = ?`,
        [req.usuario.id, req.params.id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error al reservar' });
          }

          // Insertar en tabla de reservas
          db.run(
            `INSERT INTO reservas (personaje_id, usuario_reserva_id) VALUES (?, ?)`,
            [req.params.id, req.usuario.id]
          );

          // Obtener datos del creador
          db.get(
            `SELECT u.nombre_personaje, u.id FROM usuarios u WHERE u.id = ?`,
            [personaje.usuario_id],
            (err, creador) => {
              res.json({
                exito: true,
                mensaje: 'Personaje reservado',
                personaje: {
                  ...personaje,
                  equipamiento: JSON.parse(personaje.equipamiento),
                  creador: creador.nombre_personaje,
                  whatsapp: decryptE2E(personaje.whatsapp) || personaje.whatsapp
                }
              });
            }
          );
        }
      );
    }
  );
});

// Liberar personaje (solo el creador)
app.post('/api/liberar/:id', verificarToken, (req, res) => {
  db.get(
    `SELECT * FROM personajes WHERE id = ?`,
    [req.params.id],
    (err, personaje) => {
      if (err || !personaje) {
        return res.status(404).json({ error: 'Personaje no encontrado' });
      }

      if (personaje.usuario_id !== req.usuario.id) {
        return res.status(403).json({ error: 'No tienes permiso' });
      }

      db.run(
        `UPDATE personajes SET disponible = 1, reservado_por = NULL WHERE id = ?`,
        [req.params.id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Error al liberar' });
          }
          res.json({ exito: true, mensaje: 'Personaje liberado' });
        }
      );
    }
  );
});

// Eliminar personaje
app.delete('/api/personajes/:id', verificarToken, (req, res) => {
  db.get(
    `SELECT usuario_id FROM personajes WHERE id = ?`,
    [req.params.id],
    (err, personaje) => {
      if (!personaje || personaje.usuario_id !== req.usuario.id) {
        return res.status(403).json({ error: 'No autorizado' });
      }

      db.run(`DELETE FROM personajes WHERE id = ?`, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar' });
        res.json({ exito: true });
      });
    }
  );
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
