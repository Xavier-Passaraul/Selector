# Documentación API - Selector de Personajes

## Base URL
```
http://localhost:3000/api
```

## Autenticación

Todos los endpoints (excepto registro y login) requieren un token JWT en el header:
```
Authorization: Bearer <token>
```

---

## 🔐 Autenticación

### POST /registro
Crear una nueva cuenta

**Body:**
```json
{
  "nombre_personaje": "Mi Personaje",
  "contraseña": "micontraseña123"
}
```

**Response:**
```json
{
  "id": 1,
  "nombre_personaje": "Mi Personaje",
  "token": "eyJhbGc..."
}
```

---

### POST /login
Iniciar sesión

**Body:**
```json
{
  "nombre_personaje": "Mi Personaje",
  "contraseña": "micontraseña123"
}
```

**Response:**
```json
{
  "id": 1,
  "nombre_personaje": "Mi Personaje",
  "token": "eyJhbGc..."
}
```

---

## 🎮 Personajes

### POST /personajes
Crear un nuevo personaje

**Body:**
```json
{
  "nombre_personaje": "Dragon Guerrero",
  "tipo": "Guerrero",
  "evento": "Pulpo",
  "whatsapp": "+1234567890",
  "equipamiento": {
    "Arma de dos manos": 8,
    "Escudo": 5,
    "Armadura": 10
  }
}
```

**Response:**
```json
{
  "id": 1,
  "mensaje": "Personaje creado"
}
```

---

### GET /personajes
Obtener todos los personajes disponibles (propios también si están reservados)

**Response:**
```json
[
  {
    "id": 1,
    "usuario_id": 1,
    "nombre_personaje": "Dragon Guerrero",
    "tipo": "Guerrero",
    "evento": "Pulpo",
    "hora_evento": "20:30",
    "whatsapp": "+1234567890",
    "equipamiento": {
      "Arma de dos manos": 8,
      "Escudo": 5,
      "Armadura": 10
    },
    "disponible": 1,
    "reservado_por": null,
    "creador": "Mi Personaje"
  }
]
```

---

### GET /mis-personajes
Obtener mis personajes

**Response:**
```json
[
  {
    "id": 1,
    "usuario_id": 1,
    "nombre_personaje": "Dragon Guerrero",
    "tipo": "Guerrero",
    "evento": "Pulpo",
    "hora_evento": "20:30",
    "whatsapp": "+1234567890",
    "equipamiento": {
      "Arma de dos manos": 8,
      "Escudo": 5,
      "Armadura": 10
    },
    "disponible": 1,
    "reservado_por": null
  }
]
```

---

### POST /reservar/:id
Reservar un personaje (marca como ocupado)

**URL Parameters:**
- `id` (integer): ID del personaje

**Response:**
```json
{
  "exito": true,
  "mensaje": "Personaje reservado",
  "personaje": {
    "id": 1,
    "nombre_personaje": "Dragon Guerrero",
    "tipo": "Guerrero",
    "evento": "Pulpo",
    "hora_evento": "20:30",
    "whatsapp": "+1234567890",
    "equipamiento": {...},
    "creador": "Mi Personaje"
  }
}
```

---

### POST /liberar/:id
Liberar un personaje (marca como disponible) - Solo el creador

**URL Parameters:**
- `id` (integer): ID del personaje

**Response:**
```json
{
  "exito": true,
  "mensaje": "Personaje liberado"
}
```

---

### DELETE /personajes/:id
Eliminar un personaje - Solo el creador

**URL Parameters:**
- `id` (integer): ID del personaje

**Response:**
```json
{
  "exito": true
}
```

---

## 📋 Códigos de Respuesta

| Código | Significado |
|--------|-----------|
| 200 | OK - Exitoso |
| 201 | Created - Recurso creado |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado |
| 403 | Forbidden - Prohibido (no es el propietario) |
| 404 | Not Found - Recurso no encontrado |
| 500 | Server Error - Error del servidor |

---

## 🛠️ Errores Comunes

### "El usuario ya existe"
El nombre de personaje ya está registrado. Intenta con otro nombre.

### "No autorizado"
Falta el token JWT. Asegúrate de incluir el header `Authorization`.

### "Personaje ya está reservado"
El personaje ya fue reservado por otro usuario.

### "Límite de 200 personajes alcanzado"
Ya tienes 200 personajes. Elimina uno para agregar otro.

### "No tienes permiso"
Solo el creador del personaje puede liberarlo o eliminarlo.

---

## 📝 Tipos de Personaje

### Guerrero
- Requiere: Arma de dos manos, Escudo
- Opcional: Armadura, Botas

### Taotista de Agua
- Requiere: Tizona
- Opcional: Casco, Collar, Anillo, Armadura, Botas

### Taotista de Fuego
- Requiere: Tizona
- Opcional: Casco, Collar, Anillo, Armadura, Botas

### Troyano
- Requiere: Dos Armas de una mano
- Opcional: Armadura, Botas

### Arquero
- Requiere: Arco
- Opcional: Casco, Collar, Anillo, Armadura, Botas

---

## 📅 Eventos

Los horarios se asignan automáticamente según el evento:

| Evento | Horarios |
|--------|----------|
| Pulpo | 20:30 o 23:30 |
| Reina divina | 20:30 o 23:30 |
| City War Lunes | 21:30 |
| City War Jueves | 21:30 |
| Bandera | Sábado 21:00 |
| GW | Domingo 16:00-18:00 |

---

## 🔒 Notas de Seguridad

- Las contraseñas se encriptan con bcryptjs
- Los tokens tienen un tiempo de expiración
- CORS está configurado para localhost:3000
- Las validaciones se realizan en frontend y backend
- Los IDs de usuario se extraen del token JWT

---

## 📞 Contacto WhatsApp

El número de WhatsApp incluye automáticamente el formato correcto para enviar mensajes:
```
https://wa.me/{numero_sin_caracteres_especiales}
```

Ejemplo: +1 234 567 890 → https://wa.me/12345678901
