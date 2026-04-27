# Academia SAP - Sistema de Gestión de Usuarios

Sistema web para la gestión de usuarios de una academia SAP con autenticación basada en roles.

## Tabla de Contenidos

- [Tecnologías](#tecnologías)
- [Herramientas](#heramientas)
- [Arquitectura](#arquitectura)
- [Base de Datos](#base-de-datos)
- [API Endpoints](#api-endpoints)
- [Autenticación y Autorización](#autenticación-y-autorización)
- [Características](#características)
- [Instalación](#instalación)
- [Ejecución](#ejecución)

---

## Tecnologías

### Backend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| Node.js | v18+ | Entorno de ejecución |
| Express | ^4.18.2 | Framework HTTP |
| PostgreSQL | - | Base de datos relacional |
| Sequelize | ^6.37.8 | ORM para PostgreSQL |
| bcryptjs | ^2.4.3 | Hash de contraseñas |
| jsonwebtoken | ^9.0.0 | Autenticación JWT |
| cors | ^2.8.5 | Cross-Origin Resource Sharing |
| dotenv | ^16.3.1 | Variables de entorno |

### Frontend
| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| React | ^19.2.5 | Framework UI |
| Vite | ^8.0.10 | Bundler y dev server |
| Tailwind CSS | ^4.2.4 | Framework CSS |
| Axios | ^1.15.2 | Cliente HTTP |
| React Router | ^6.x | Enrutamiento |

---

## Herramientas

- **PostgreSQL** - Sistema de gestión de base de datos relacional
- **Visual Studio Code** - Editor de código
- **Postman** - Pruebas de API (opcional)
- **pgAdmin** - GUI para PostgreSQL (opcional)

---

## Arquitectura

```
academia-sap/
├── academia-sap-api/          # Backend
│   ├── models/
│   │   └── User.js            # Modelo Sequelize
│   ├── routes/
│   │   └── auth.js            # Rutas de autenticación
│   ├── server.js              # Entry point
│   ├── package.json
│   └── .env                   # Variables de entorno (no incluir en git)
│
├── academia-sap-frontend/      # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── UserModal.jsx  # Componente principal
│   │   │   ├── Login.jsx      # Formulario login/registro
│   │   │   └── PrivateRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   │   └── admin-avatar.png   # Avatar admin
│   ├── index.html
│   └── package.json
│
├── .gitignore                  # Git ignore (no incluir node_modules, .env, etc.)
└── README.md
```

---

## Base de Datos

### Schema: Users

| Campo | Tipo | Constraints | Descripción |
|-------|------|-------------|-------------|
| id | INTEGER | PRIMARY KEY, AUTO | Identificador único |
| nombre | VARCHAR(255) | NOT NULL | Nombre del usuario |
| apellido | VARCHAR(255) | - | Apellido |
| empresa | VARCHAR(255) | - | Empresa |
| telefono | VARCHAR(50) | - | Teléfono (+51) |
| cargo | VARCHAR(255) | - | Cargo/Ocupación |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email (único) |
| comentario | TEXT | - | Comentarios |
| password | VARCHAR(255) | NOT NULL | Contraseña hasheada |
| role | ENUM | DEFAULT 'user' | Rol: 'admin' o 'user' |
| passwordChangeRequired | BOOLEAN | DEFAULT false | Obliga cambio de contraseña |
| createdAt | TIMESTAMP | AUTO | Fecha creación |
| updatedAt | TIMESTAMP | AUTO | Fecha actualización |

---

## API Endpoints

### Autenticación (`/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Iniciar sesión | No |
| POST | `/auth/register` | Registrar usuario | No |
| POST | `/auth/change-password` | Cambiar contraseña | Sí (token limitado) |

### Usuarios (`/usuarios`)

| Método | Endpoint | Descripción | Auth | Rol |
|--------|----------|-------------|------|-----|
| GET | `/usuarios` | Listar usuarios | Sí | Admin ve todos, User ve solo sí mismo |
| POST | `/usuarios` | Crear usuario | Sí | Admin |
| PUT | `/usuarios/:id` | Actualizar usuario | Sí | Admin (todo), User (solo sí mismo, sin rol) |
| DELETE | `/usuarios/:id` | Eliminar usuario | Sí | Admin |

### Ejemplo: Login Request
```json
POST /auth/login
{
  "email": "admin@academia-sap.com",
  "password": "manage"
}
```

### Ejemplo: Login Response
```json
{
  "user": {
    "id": 1,
    "nombre": "Admin",
    "apellido": "Sistema",
    "email": "admin@academia-sap.com",
    "role": "admin",
    "passwordChangeRequired": true
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "tokenType": "constrained"
}
```

### Ejemplo: Crear Usuario (Admin)
```json
POST /usuarios
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "empresa": "SAP Perú",
  "telefono": "+51 987 654 321",
  "cargo": "Consultor",
  "email": "juan.perez@sap.com",
  "comentario": "Usuario nuevo"
}
```

### Ejemplo: Actualizar Usuario con Reset Contraseña
```json
PUT /usuarios/2
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "empresa": "SAP Perú",
  "telefono": "+51 987 654 321",
  "cargo": "Consultor Senior",
  "email": "juan.perez@sap.com",
  "comentario": "Actualizado",
  "resetPassword": "yes"
}
```

---

## Autenticación y Autorización

### Flujo de Tokens

1. **Token Completo (`full`)**: Acceso total a todas las rutas
2. **Token Limitado (`constrained`)**: Solo permite `POST /auth/change-password`

### Tipos de Usuario

| Rol | Permisos |
|-----|----------|
| **admin** | Crear, editar, eliminar usuarios. Reiniciar contraseñas. Ver todos los usuarios. |
| **user** | Solo ver y editar su propio perfil. No puede ver otros usuarios. |

### Flujo de Autenticación

```
1. Usuario inicia sesión
   ├── Si passwordChangeRequired = true → Token limitado (constrained)
   │   └── Solo puede cambiar contraseña
   └── Si passwordChangeRequired = false → Token completo (full)
       └── Acceso total a la aplicación

2. Usuario normal:
   └── Al ser creado por admin → password = email del usuario
       └── Primer login: email como contraseña
           └── Modal obligatorio para cambiar contraseña
               └── Nueva contraseña almacenada hasheada
```

### Claves de Seguridad

- `JWT_SECRET`: Clave para tokens completos (7 días expiración)
- `JWT_CONSTRAINED`: Clave para tokens limitados (24 horas expiración)
- `ADMIN_KEY`: Clave para registro inicial de admin (no usada actualmente)

---

## Características

### Administrador
- Iniciar sesión con credenciales por defecto
- Cambiar contraseña en primer inicio
- Crear nuevos usuarios
- Editar datos de usuarios
- Reiniciar contraseña de usuarios (restablece a email + obliga cambio)
- Eliminar usuarios
- Ver lista de todos los usuarios

### Usuario Normal
- Iniciar sesión con email como contraseña inicial
- Cambiar contraseña obligatoria al primer login
- Editar solo sus propios datos (excepto rol)
- Ver solo su propio perfil

### Frontend
- Modal de cambio de contraseña obligatorio
- Diseño responsive con Tailwind CSS
- Estados de carga (spinners)
- Mensajes de error/éxito
- Avatar personalizado para admin
- Badges de rol en header y tabla

---

## Instalación

### Requisitos Previos
- Node.js v18+
- PostgreSQL instalado y corriendo
- Base de datos `academia_sap` creada

### Clonar Repositorio

```bash
git clone https://github.com/tu-usuario/academia-sap.git
cd academia-sap
```

### Instalar Dependencias

```bash
# Backend
cd academia-sap-api
npm install

# Frontend
cd ../academia-sap-frontend
npm install
```

### Configurar Base de Datos

Asegúrate que PostgreSQL esté corriendo y crea la base de datos:

```sql
CREATE DATABASE academia_sap;
```

### Configurar Variables de Entorno

Crea el archivo `.env` en `academia-sap-api/` con tus credenciales:

```env
PORT=3000
DATABASE_URL=postgres://tu_usuario:tu_password@localhost:5432/academia_sap
JWT_SECRET=tu-clave-secreta-jwt
JWT_CONSTRAINED=tu-clave-constrained
```

---

## Ejecución

### 1. Backend

```bash
cd academia-sap-api
npm start
```

Deberías ver:
```
Conectado a PostgreSQL
Usuario administrador creado: admin@academia-sap.com / manage
Servidor en puerto 3000
```

### 2. Frontend

En otra terminal:

```bash
cd academia-sap-frontend
npm run dev
```

Accede a `http://localhost:5173` (o el puerto que muestre)

---

## Variables de Entorno

### Backend (.env)
```env
PORT=3000
DATABASE_URL=postgres://usuario:password@localhost:5432/academia_sap
JWT_SECRET=academia-sap-secret-key-2024
JWT_CONSTRAINED=academia-sap-constrained-key
ADMIN_KEY=admin-secreto-2024
```

### Credenciales Admin (por defecto)
```
Email: admin@academia-sap.com
Contraseña: manage
```

---

## Notas de Desarrollo

- El admin se recrea automáticamente al iniciar el servidor si no existe
- La tabla se sincroniza con `alter: true` para agregar columnas faltantes
- Los passwords se hashean con bcrypt (10 rounds)
- Los radio buttons de "Reiniciar Contraseña" usan estado separado para evitar conflictos con el form principal
