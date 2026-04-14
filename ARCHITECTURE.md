# 🏗️ Arquitectura del Sistema

## Diagrama General del Flujo

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENTE (NAVEGADOR)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  index.html  │  styles.css  │  script.js            │   │
│  │              │              │                        │   │
│  │ - UI chino   │ - Estilos    │ - Lógica cliente      │   │
│  │ - Formularios│   antiguo    │ - Fetch API           │   │
│  │ - Modales    │   chino      │ - Gestión estado      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                           │
                    (HTTP/JSON)
                           │
         ┌─────────────────▼─────────────────┐
         │    SERVIDOR (server.js)           │
         │  ┌─────────────────────────────┐  │
         │  │   Express.js Rutas API      │  │
         │  ├─────────────────────────────┤  │
         │  │ • POST /registro            │  │
         │  │ • POST /login               │  │
         │  │ • POST /personajes          │  │
         │  │ • GET /personajes           │  │
         │  │ • GET /mis-personajes       │  │
         │  │ • POST /reservar/:id        │  │
         │  │ • POST /liberar/:id         │  │
         │  │ • DELETE /personajes/:id    │  │
         │  └─────────────────────────────┘  │
         └─────────────────┬─────────────────┘
                           │
                    (Consultas SQL)
                           │
         ┌─────────────────▼─────────────────┐
         │    BASE DE DATOS (SQLite3)        │
         │  ┌─────────────────────────────┐  │
         │  │ Tablas:                     │  │
         │  │ • usuarios                  │  │
         │  │ • personajes                │  │
         │  │ • reservas                  │  │
         │  └─────────────────────────────┘  │
         │  db/database.db                   │
         └─────────────────────────────────┘
```

## Flujo de Autenticación

```
┌─────────┐
│ Usuario │
└────┬────┘
     │ 1. Registro
     ▼
┌──────────────────┐
│  POST /registro  │
│  • nombre_       │  2. Validar datos
│  • contraseña    │  3. Encriptar (bcrypt)
│  • confirmar     │  4. Guardar en BD
└────┬─────────────┘
     │ 5. Retorna token JWT
     ▼
┌──────────────────┐
│  Token Guardado  │  localStorage
│  ID: 1           │  usuario: "Mi Guerrero"
│  token: "xxxxxx" │
└──────────────────┘
     │
     │ 6. Usar en futuras solicitudes
     │    Authorization: Bearer <token>
     ▼
┌──────────────────┐
│ Autenticado ✓    │
└──────────────────┘
```

## Flujo de Creación de Personaje

```
┌─────────────────────┐
│  Clic en            │
│  "Agregar Personaje"│
└────────┬────────────┘
         │
         ▼
    ┌────────────┐
    │ Modal Abre │
    └────┬───────┘
         │
    Selecciona Tipo → actualizarEquipamiento()
         │
         ├─ Guerrero → Arma 2 manos + Escudo required
         ├─ Taotista → Tizona required
         ├─ Troyano → Armas x2 required
         ├─ Arquero → Arco required
         └─ ...
         │
         ▼
    ┌──────────────┐
    │ Rellena Form │
    └────┬─────────┘
         │
         ▼
    ┌──────────────────────────┐
    │ POST /personajes         │
    │ • nombre_personaje       │
    │ • tipo                   │
    │ • evento                 │
    │ • whatsapp               │
    │ • equipamiento (JSON)    │
    └────┬─────────────────────┘
         │ 1. Validar límite 200
         │ 2. Asignar hora automática (evento)
         │ 3. Guardar en BD
         ▼
    ┌──────────────────┐
    │ Personaje Creado │
    │ ID: 1234         │
    └──────────────────┘
         │
         ▼
    ┌───────────────────────┐
    │ Mostrar en            │
    │ "Mis Personajes"      │
    └───────────────────────┘
```

## Flujo de Reserva de Personaje

```
┌────────────────────────────────┐
│ Usuario B busca personajes     │
│ Tab: "Buscar Personajes"       │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ GET /personajes                │
│ (todos disponibles + míos si   │
│  están reservados)             │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Muestra Tarjetas de Personajes │
│ • Nombre                       │
│ • Tipo                         │
│ • Evento + Hora                │
│ • Creador                      │
│ • Botón: "Ver Detalles"        │
└────────┬───────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│ Clic en "Ver Detalles"         │
└────┬───────────────────────────┘
     │
     ▼
┌────────────────────────────────┐
│ Modal: Detalles Completos      │
│ • Todo lo anterior             │
│ • Equipamiento                 │
│ • Botón: "Reservar Personaje"  │
└────┬───────────────────────────┘
     │
     ▼
┌────────────────────────────────┐
│ POST /reservar/:id             │
│ (1. Marcar como ocupado        │
│  2. Guardar quién lo reservó   │
│  3. Crear registro de reserva) │
└────┬───────────────────────────┘
     │ 4. Retorna detalles personaje
     │    + creador + whatsapp
     ▼
┌────────────────────────────────┐
│ Modal: Reserva Exitosa! ✓      │
│ Muestra:                       │
│ • Datos personaje              │
│ • Creador                      │
│ • Botón: "Enviar Mensaje WA"   │
│   → https://wa.me/123456789    │
└────────────────────────────────┘

RESULTADO FINAL:
- Usuario B: Ve pop-up con WhatsApp
- Usuario A: Personaje marca como OCUPADO
- En "Mis Personajes": Botón "Liberar"
```

## Estructura de Base de Datos

### Tabla: usuarios
```
id (PK)
nombre_personaje (UNIQUE)
contraseña (hash bcrypt)
creado_en (TIMESTAMP)
```

### Tabla: personajes
```
id (PK)
usuario_id (FK → usuarios.id)
nombre_personaje
tipo (Guerrero|Taotista agua|Taotista fuego|Troyano|Arquero)
evento
hora_evento
whatsapp
equipamiento (JSON)
disponible (0|1)
reservado_por (FK → usuarios.id, nullable)
creado_en (TIMESTAMP)
```

### Tabla: reservas
```
id (PK)
personaje_id (FK → personajes.id)
usuario_reserva_id (FK → usuarios.id)
fecha_reserva (TIMESTAMP)
```

## Seguridad

### Encriptación de Contraseña
```
Usuario ingresa: "micontraseña123"
                    ↓
            bcryptjs.hashSync()
                    ↓
         Guardado en BD: $2a$10$...
                    ↓
En login: bcryptjs.compareSync()
                    ↓
        Contraseña válida ✓
```

### Token JWT
```
Payload:
{
  id: 1,
  nombre_personaje: "Mi Guerrero",
  iat: 1713088000,
  exp: (configurable)
}

Firmado con: SECRET_KEY
Se usa en: Authorization: Bearer <token>
Verificado en: verificarToken middleware
```

## Flujo de Equipamiento

### Por Tipo de Personaje

```
GUERRERO
┌──────────────────────────┐
│ REQUERIDO:               │
│ □ Arma de dos manos: +1-12
│ □ Escudo: +1-12          │
│                          │
│ OPCIONAL:                │
│ □ Armadura: +1-12        │
│ □ Botas: +1-12           │
└──────────────────────────┘

TAOTISTA DE AGUA / FUEGO
┌──────────────────────────┐
│ REQUERIDO:               │
│ □ Tizona: +1-12          │
│                          │
│ OPCIONAL:                │
│ □ Casco: +1-12           │
│ □ Collar: +1-12          │
│ □ Anillo: +1-12          │
│ □ Armadura: +1-12        │
│ □ Botas: +1-12           │
└──────────────────────────┘

TROYANO
┌──────────────────────────┐
│ REQUERIDO:               │
│ □ Arma de una mano: +1-12
│ □ Arma de una mano: +1-12
│                          │
│ OPCIONAL:                │
│ □ Armadura: +1-12        │
│ □ Botas: +1-12           │
└──────────────────────────┘

ARQUERO
┌──────────────────────────┐
│ REQUERIDO:               │
│ □ Arco: +1-12            │
│                          │
│ OPCIONAL:                │
│ □ Casco: +1-12           │
│ □ Collar: +1-12          │
│ □ Anillo: +1-12          │
│ □ Armadura: +1-12        │
│ □ Botas: +1-12           │
└──────────────────────────┘
```

## Ciclo de Vida del Personaje

```
CREADO
  │
  ├─ Disponible=1, Reservado_por=NULL
  │
  ▼
SOLO VISIBLE PARA CREADOR O SI DISPONIBLE=1
  │
  ├─ Reserva
  │  │
  │  ├─ POST /reservar
  │  │
  │  ▼
  │  OCUPADO
  │  └─ Disponible=0, Reservado_por=ID_Usuario
  │     │
  │     ├─ Solo creador puede liberar
  │     │
  │     ▼
  │     LIBERAR
  │     └─ POST /liberar
  │        │
  │        ▼
  │        DISPONIBLE (regresa)
  │
  └─ ELIMINAR
     │
     └─ DELETE /personajes/:id
        └─ (solo creador)
```

---

**Toda la aplicación está diseñada para ser escalable y mantenible.**
