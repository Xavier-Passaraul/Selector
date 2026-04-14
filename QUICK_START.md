# 🚀 Guía de Inicio Rápido

## Instalación (2 minutos)

### Windows
```bash
cd "d:\Users\Xavier\Desktop\Programacion\Tiendas Online\Selector"
install.bat
```

### Mac/Linux
```bash
cd "d:\Users\Xavier\Desktop\Programacion\Tiendas Online\Selector"
bash install.sh
```

### Manual
```bash
npm install
npm start
```

## Resultado esperado
```
Conectado a SQLite
Servidor ejecutándose en http://localhost:3000
```

---

## Primer Uso (5 minutos)

### 1️⃣ Abre el navegador
```
http://localhost:3000
```

### 2️⃣ Crea una cuenta
- Nombre: `Mi Guerrero` (o lo que prefieras)
- Contraseña: `micontraseña123`

### 3️⃣ Agrega tu primer personaje
Haz clic en **"Agregar Personaje"** y completa:

| Campo | Valor Ejemplo |
|-------|---------------|
| Nombre | Dragon Guerrero |
| Tipo | Guerrero |
| Evento | Pulpo |
| WhatsApp | +1234567890 |
| Arma 2 manos | 8 |
| Escudo | 5 |
| Armadura | 10 |

Haz clic en **"Guardar Cambios"**

### 4️⃣ Ve tus personajes
- Tab: **"Mis Personajes"**
- Verás tu Dragon Guerrero creado ✓

### 5️⃣ Busca otros personajes
Para probar la reserva, crea una 2ª cuenta:

1. Logout (arriba derecha)
2. Clic en **"¿No tienes cuenta? Crear una"**
3. Nombre: `Mi Taotista`
4. Crea un personaje Taotista de agua
5. Logout nuevamente

### 6️⃣ Prueba reserva
1. Login con `Mi Guerrero`
2. Tab: **"Buscar Personajes"**
3. Verás el Taotista de agua
4. Clic en **"Ver Detalles"**
5. Clic en **"Reservar Personaje"**
6. ¡Pop-up con el WhatsApp del creador! 🎉

---

## 🎯 Casos de Prueba

### ✅ Crear Guerrero
- Requiere: Arma 2 manos + Escudo
- Opcional: Armadura, Botas

### ✅ Crear Taotista Agua
- Requiere: Tizona
- Opcional: Casco, Collar, Anillo, Armadura, Botas

### ✅ Crear Troyano
- Requiere: Dos Armas de una mano
- Opcional: Armadura, Botas

### ✅ Crear Arquero
- Requiere: Arco
- Opcional: Casco, Collar, Anillo, Armadura, Botas

### ✅ Eventos con Horarios
- Pulpo → **20:30 o 23:30** (aleatorio)
- Reina divina → **20:30 o 23:30**
- City War Lunes → **21:30**
- City War Jueves → **21:30**
- Bandera → **Sábado 21:00**
- GW → **Domingo 16:00-18:00**

### ✅ Sistema de Reserva
1. Crear personaje con usuario A
2. Buscar con usuario B
3. Ver detalles y reservar
4. Pop-up aparece con WhatsApp

### ✅ Liberar Personaje
1. Usuario A va a "Mis Personajes"
2. Si está reservado, aparece botón "Liberar"
3. Click → Personaje disponible de nuevo

---

## 🛠️ Soluciones Rápidas

### Puerto 3000 en uso
```bash
# Edita server.js (última línea)
const PORT = 3001;
# Luego: npm start
```

### Error de conexión a BD
```bash
# Elimina la BD y reinicia
del db\database.db       # Windows
rm db/database.db        # Mac/Linux
npm start
```

### Problemas de CORS
```bash
# Asegúrate de acceder desde:
http://localhost:3000
# NO desde: http://127.0.0.1:3000
```

---

## 📊 Información de Prueba

### Base de Datos
- Ubicación: `db/database.db`
- Tipo: SQLite3
- Tablas: usuarios, personajes, reservas

### Límites
- Máximo 200 personajes por usuario
- Equipamiento: +1 a +12 (solo números)
- Contraseña mínima: 6 caracteres

### Token JWT
- Se guarda automáticamente en navegador
- Válido para la sesión
- Se envía en cada solicitud

---

## 🎨 Características Visuales

✨ Estilo antiguo chino
- Colores: Oro, marrón, rojo
- Fuente: Georgia, SimSun
- Efectos hover en botones
- Responsivo en móvil

---

## 📚 Documentación Completa

- `README.md` - Descripción general
- `API_DOCS.md` - Endpoints y respuestas
- `QUICK_START.md` - Esta guía

---

## ❓ Preguntas Frecuentes

**¿Cómo cambio el puerto?**
→ Edita la última línea de `server.js`

**¿Dónde está mi base de datos?**
→ En `db/database.db`

**¿Puedo respaldar mis datos?**
→ Copia `db/database.db` a otro lugar

**¿Cómo reseteo todo?**
→ Elimina `db/database.db` y reinicia

---

## 🏮 ¡Hecho!

Tu aplicación está lista. Disfruta creando personajes.

**修仙者选择** - Selector de Personajes para Eventos
