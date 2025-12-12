# VocAI Backend

Backend de Node.js + Express + MongoDB para el sistema de orientación vocacional VocAI.

## 📋 Requisitos previos

- Node.js 18+
- MongoDB local (o URI remota)
- npm o yarn

## 🚀 Instalación y configuración

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env` y ajusta los valores:

```bash
cp .env.example .env
```

Contenido de `.env`:
```
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/vocai_db
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

### 3. Iniciar MongoDB (local)

```bash
# En Windows (si MongoDB está instalado)
mongod

# O si usas Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Ejecutar el servidor

**Modo desarrollo (con hot reload):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:4000`

---

## 📚 Estructura del proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Conexión a MongoDB
│   ├── controllers/
│   │   ├── authController.js  # Lógica de autenticación
│   │   ├── careerController.js # Lógica de carreras
│   │   └── profileController.js # Lógica de perfiles vocacionales
│   ├── middleware/
│   │   └── authMiddleware.js  # Validación de JWT
│   ├── models/
│   │   ├── User.js            # Schema de usuarios
│   │   ├── Career.js          # Schema de carreras
│   │   └── VocationalProfile.js # Schema de perfiles vocacionales
│   ├── routes/
│   │   ├── authRoutes.js      # Rutas de autenticación
│   │   ├── careerRoutes.js    # Rutas de carreras
│   │   └── profileRoutes.js   # Rutas de perfiles
│   └── index.js               # Punto de entrada
├── .env.example               # Variables de entorno (plantilla)
└── package.json               # Dependencias
```

---

## 🔑 API Endpoints

### 🔐 Autenticación (`/api/auth`)

#### POST `/api/auth/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@ejemplo.com"
  }
}
```

#### POST `/api/auth/login`
Inicia sesión de un usuario.

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "usuario@ejemplo.com"
  }
}
```

#### POST `/api/auth/forgot`
Solicita recuperación de contraseña (mock).

**Body:**
```json
{
  "email": "usuario@ejemplo.com"
}
```

**Response (200):**
```json
{
  "message": "Si el email existe, recibirás instrucciones para recuperar tu contraseña"
}
```

---

### 📚 Carreras (`/api/careers`)

#### GET `/api/careers`
Obtiene todas las carreras del Departamento de Tecnología Digital de TECSUP – Sede Lima (6 carreras).

**Response (200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Diseño y Desarrollo de Software",
    "area": "Tecnologías de la Información",
    "sede": ["Lima"],
    "duration": "3 años",
    "salary": 2500,
    "demand": "Alta",
    "description": "...",
    "profile": "...",
    "skills": ["Programación", "Bases de datos"],
    "occupations": ["Desarrollador Fullstack"]
  }
]
```

#### GET `/api/careers/:id`
Obtiene una carrera específica.

**Response (200):** (objeto de carrera)

#### POST `/api/careers/seed`
Inserta las 6 carreras del Departamento de Tecnología Digital de TECSUP – Sede Lima en la base de datos (solo funciona si la colección está vacía).

**Response (200):**
```json
{
  "message": "Carreras seed insertadas",
  "count": 6
}
```

---

### 👤 Perfiles Vocacionales (`/api/profiles`)
*Requiere autenticación (Bearer token)*

#### POST `/api/profiles`
Crea un nuevo perfil vocacional.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "answers": [1, 3, 5, 2, 4, 3, 5, 2, 4, 3, 5, 2, 4, 3, 5],
  "areaScores": {
    "TI": 85,
    "Social": 60,
    "Ciencias": 75
  },
  "topCareers": [
    {
      "careerId": "507f1f77bcf86cd799439012",
      "name": "Diseño y Desarrollo de Software",
      "affinity": 85
    }
  ]
}
```

**Response (201):** (perfil creado)

#### GET `/api/profiles/me`
Obtiene el último perfil vocacional del usuario.

**Response (200):** (perfil vocacional)

#### GET `/api/profiles/history`
Obtiene el historial completo de perfiles del usuario.

**Response (200):**
```json
[
  { ...profile1 },
  { ...profile2 }
]
```

#### GET `/api/profiles/:id`
Obtiene un perfil vocacional específico (debe pertenecer al usuario).

**Response (200):** (perfil vocacional)

---

## 🧪 Pruebas rápidas (con Postman o curl)

### 1. Registrar usuario
```bash
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

### 2. Iniciar sesión
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'
```

### 3. Obtener carreras
```bash
curl http://localhost:4000/api/careers
```

### 4. Seed de carreras
```bash
curl -X POST http://localhost:4000/api/careers/seed
```

### 5. Crear perfil (requiere token)
```bash
curl -X POST http://localhost:4000/api/profiles \
  -H "Authorization: Bearer <token_aqui>" \
  -H "Content-Type: application/json" \
  -d '{"answers":[1,2,3,4,5,1,2,3,4,5,1,2,3,4,5],"areaScores":{"TI":70},"topCareers":[]}'
```

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcryptjs (salt rounds: 10)
- ✅ JWT con expiración de 7 días
- ✅ CORS habilitado (configurable)
- ✅ Validación de entrada en todos los endpoints
- ✅ Middleware de autenticación para rutas protegidas
- ⚠️ TODO: Implementar rate limiting
- ⚠️ TODO: Implementar HTTPS en producción

---

## 📝 Variables de entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `4000` |
| `MONGO_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/vocai_db` |
| `JWT_SECRET` | Clave secreta para JWT | `super_secret_key` |
| `OPENAI_API_KEY` | Clave de API de OpenAI para IA vocacional | `sk-...` |

---

## 🐛 Solución de problemas

### MongoDB no se conecta
- Verifica que MongoDB está corriendo: `mongod`
- Comprueba que `MONGO_URI` es correcto en `.env`

### Error "Token no válido"
- Asegúrate de enviar el token en el header: `Authorization: Bearer <token>`
- Comprueba que `JWT_SECRET` es igual en servidor y cliente

### Puerto 4000 en uso
- Cambia `PORT` en `.env` a otro puerto (ej: `4001`)

---

## 🚀 Próximos pasos

- [ ] Integrar servicio de email real (nodemailer, SendGrid)
- [ ] Implementar rate limiting
- [ ] Agregar documentación con Swagger
- [ ] Tests unitarios (Jest)
- [ ] Docker setup (Dockerfile, docker-compose.yml)
- [ ] CI/CD con GitHub Actions

---

## 📄 Licencia

MIT

---

## 👨‍💻 Autor

VocAI Team
