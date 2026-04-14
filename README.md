# 修仙者选择 - Selector de Personajes para Eventos

Una aplicación web moderna con estilo antiguo chino para gestionar personajes de eventos en línea.

## 📋 Descripción

Sistema completo de gestión de personajes para eventos organizacionales. Permite crear un usuario, agregar personajes con equipamiento personalizado, reservar personajes de otros usuarios y gestionar la disponibilidad de los mismos.

## 🎯 Características

✨ **Autenticación de Usuarios**
- Registro e inicio de sesión seguro
- Passwords encriptados con bcryptjs
- Tokens JWT para autenticación

🎮 **Gestión de Personajes**
- Crear hasta 200 personajes por usuario
- 5 tipos de personaje: Guerrero, Taotista de agua/fuego, Troyano, Arquero
- Equipamiento customizable con valores +1 a +12
- Restricciones de equipamiento según tipo de personaje

📅 **Sistema de Eventos**
- 6 tipos de eventos con horarios automáticos:
  - Pulpo: 20:30 o 23:30
  - Reina divina: 20:30 o 23:30
  - City War Lunes: 21:30
  - City War Jueves: 21:30
  - Bandera: Sábado 21:00
  - GW: Domingo 16:00-18:00

🔐 **Sistema de Reservas**
- Reservar personajes de otros usuarios
- Reservas automáticas marcan personajes como ocupados
- Solo el creador puede liberar el personaje
- Pop-up con detalles y WhatsApp del creador

🎨 **Estilo Antiguo Chino**
- Paleta de colores tradicional
- Tipografía elegante
- Diseño responsivo

## 🛠️ Instalación

### Requisitos
- Node.js v14 o superior
- npm o yarn

### Pasos de Instalación

1. **Clonar/Abrir el proyecto**
```bash
cd "d:\Users\Xavier\Desktop\Programacion\Tiendas Online\Selector"
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Crear carpeta de base de datos**
```bash
mkdir db
```

4. **Iniciar el servidor**
```bash
npm start
```

El servidor se ejecutará en `http://localhost:3000`

## 📱 Uso

### 1. Registrar Usuario
- Abre `http://localhost:3000` en tu navegador
- Haz clic en "Crear una cuenta"
- Ingresa un nombre de personaje y contraseña
- Confirma la contraseña

### 2. Agregar Personaje
- Una vez logueado, haz clic en "Agregar Personaje"
- Completa los campos:
  - **Nombre**: Nombre único del personaje
  - **Tipo**: Elige el tipo (Guerrero, Taotista, etc.)
  - **Evento**: Selecciona el evento (hora se autoasigna)
  - **WhatsApp**: Número de contacto
  - **Equipamiento**: Según el tipo de personaje

### 3. Buscar y Reservar
- Ve a "Buscar Personajes" para ver personajes disponibles
- Haz clic en "Ver Detalles"
- Presiona "Reservar Personaje"
- Recibirás un pop-up con el WhatsApp del creador

### 4. Gestionar Personajes
- En "Mis Personajes" puedes ver tus creaciones
- Libera un personaje si fue reservado
- Elimina personajes a voluntad

## 🗂️ Estructura del Proyecto

```
Selector/
├── server.js              # Backend Express
├── package.json           # Dependencias
├── db/                    # Carpeta de base de datos (se crea automáticamente)
│   └── database.db        # Base de datos SQLite
└── public/
    ├── index.html         # HTML principal
    ├── styles.css         # Estilos CSS
    └── script.js          # Lógica JavaScript
```

## 🔧 Tecnologías

- **Backend**: Node.js, Express.js
- **Base de Datos**: SQLite3
- **Autenticación**: bcryptjs, JWT
- **Frontend**: HTML5, CSS3, JavaScript vanilla
- **Seguridad**: CORS, Body-Parser

## 🎮 Restricciones de Equipamiento por Tipo

### Guerrero
- Arma de dos manos (requerido)
- Escudo (requerido)
- Armadura (opcional)
- Botas (opcional)

### Taotista de Agua/Fuego
- Tizona (requerido)
- Casco, Collar, Anillo, Armadura, Botas (opcionales)

### Troyano
- Dos Armas de una mano (requeridas)
- Armadura, Botas (opcionales)

### Arquero
- Arco (requerido)
- Casco, Collar, Anillo, Armadura, Botas (opcionales)

## 📊 API Endpoints

### Autenticación
- `POST /api/registro` - Registrar usuario
- `POST /api/login` - Iniciar sesión

### Personajes
- `POST /api/personajes` - Crear personaje
- `GET /api/personajes` - Listar personajes disponibles
- `GET /api/mis-personajes` - Listar mis personajes
- `POST /api/reservar/:id` - Reservar personaje
- `POST /api/liberar/:id` - Liberar personaje
- `DELETE /api/personajes/:id` - Eliminar personaje

## 🔒 Seguridad

- Los passwords se encriptan con bcryptjs
- Los tokens JWT expiran según configuración
- CORS está habilitado para comunicación segura
- Validación en frontend y backend

## 📝 Notas

- La base de datos se crea automáticamente en la primera ejecución
- Máximo 200 personajes por usuario
- Los valores de equipamiento van de +1 a +12
- Las horas se asignan automáticamente según el evento seleccionado

## 🐛 Solucionar Problemas

### El puerto 3000 ya está ocupado
```bash
# Cambiar puerto en server.js (última línea)
const PORT = 3001; // o otro número disponible
```

### CORS error
```bash
# Asegúrate de que el frontend accesa desde http://localhost:3000
```

### Base de datos corrupta
```bash
# Elimina el archivo db/database.db y reinicia
# Se creará una nueva base de datos automáticamente
```

## 📄 Licencia

Proyecto personal - 2026

---

**Disfruta creando tus personajes para eventos! 修仙者选择**
