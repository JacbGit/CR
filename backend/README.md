# 🎰 Casino Royal - Backend

Backend API REST para la plataforma de casino en línea Casino Royal. Desarrollado con NestJS, TypeORM y PostgreSQL.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Base de Datos](#base-de-datos)
- [Ejecución](#ejecución)
- [API Endpoints](#api-endpoints)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Juegos Disponibles](#juegos-disponibles)

## ✨ Características

- ✅ Autenticación JWT
- ✅ Registro y login de usuarios
- ✅ Sistema de saldo virtual
- ✅ 5 juegos de casino: Ruleta, Dados, Tragamonedas, Blackjack, Póker
- ✅ Historial de partidas
- ✅ Sistema de transacciones
- ✅ Estadísticas de jugador
- ✅ API RESTful documentada
- ✅ Validación de datos
- ✅ Manejo de errores
- ✅ CORS configurado

## 🛠 Tecnologías

- **Framework:** NestJS 10
- **Base de Datos:** PostgreSQL 15+
- **ORM:** TypeORM 0.3
- **Autenticación:** Passport JWT
- **Validación:** class-validator
- **Lenguaje:** TypeScript 5
- **Runtime:** Node.js 18+

## 📦 Requisitos Previos

- Node.js 18 o superior
- PostgreSQL 15 o superior
- npm o yarn
- Git

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <repository-url>
cd casino-royal-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copiar el archivo de ejemplo y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus configuraciones:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password
DB_NAME=casino_royal_db

# JWT
JWT_SECRET=tu_secreto_super_seguro
JWT_EXPIRATION=24h

# App
PORT=3000
NODE_ENV=development
```

## 🗄 Base de Datos

### Crear la base de datos

**Opción 1: Usando el script SQL**

```bash
psql -U postgres -f database/schema.sql
```

**Opción 2: Manualmente**

```sql
CREATE DATABASE casino_royal_db;
\c casino_royal_db
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Ejecutar migraciones (si usas synchronize: false)

```bash
npm run migration:run
```

### Verificar tablas

```bash
psql -U postgres -d casino_royal_db
\dt
```

Deberías ver:
- `users`
- `transactions`
- `game_history`

## 🏃‍♂️ Ejecución

### Desarrollo

```bash
npm run start:dev
```

La API estará disponible en: `http://localhost:3000`

### Producción

```bash
npm run build
npm run start:prod
```

### Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📚 API Endpoints

### Autenticación

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Registrar nuevo usuario | No |
| POST | `/api/auth/login` | Iniciar sesión | No |
| GET | `/api/auth/verify` | Verificar token | Sí |

**Ejemplo Register:**
```json
POST /api/auth/register
{
  "username": "jugador1",
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan@example.com",
  "password": "Password123"
}
```

**Respuesta:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "username": "jugador1",
    "balance": 1000.00,
    ...
  }
}
```

### Usuarios

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/users/me` | Obtener perfil | Sí |
| PATCH | `/api/users/me` | Actualizar perfil | Sí |
| POST | `/api/users/me/change-password` | Cambiar contraseña | Sí |
| GET | `/api/users` | Listar usuarios | Sí |

### Juegos

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/api/games/roulette/play` | Jugar ruleta | Sí |
| POST | `/api/games/dice/play` | Jugar dados | Sí |
| POST | `/api/games/slots/play` | Jugar tragamonedas | Sí |
| GET | `/api/games/stats` | Estadísticas de juego | Sí |

**Ejemplo Ruleta:**
```json
POST /api/games/roulette/play
Headers: Authorization: Bearer <token>
{
  "gameType": "roulette",
  "amount": 50,
  "betType": "color",
  "value": "red"
}
```

**Respuesta:**
```json
{
  "result": {
    "won": true,
    "winningNumber": 12,
    "isRed": true,
    "betType": "color",
    "betValue": "red"
  },
  "betAmount": 50,
  "winAmount": 50,
  "newBalance": 1000
}
```

### Historial

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/game-history` | Historial completo | Sí |
| GET | `/api/game-history/recent` | Últimas partidas | Sí |
| GET | `/api/game-history/game/:gameType` | Por tipo de juego | Sí |
| GET | `/api/game-history/game/:gameType/stats` | Estadísticas por juego | Sí |

### Transacciones

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/api/transactions` | Listar transacciones | Sí |
| GET | `/api/transactions/summary` | Resumen financiero | Sí |
| GET | `/api/transactions/:id` | Detalle transacción | Sí |

## 📁 Estructura del Proyecto

```
casino-royal-backend/
├── src/
│   ├── auth/                 # Módulo de autenticación
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── guards/          # Guards de autenticación
│   │   ├── strategies/      # Estrategias Passport
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── users/               # Módulo de usuarios
│   │   ├── dto/
│   │   ├── user.entity.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── games/               # Módulo de juegos
│   │   ├── dto/
│   │   ├── games.controller.ts
│   │   ├── games.service.ts
│   │   └── games.module.ts
│   ├── transactions/        # Módulo de transacciones
│   │   ├── transaction.entity.ts
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── transactions.module.ts
│   ├── game-history/        # Módulo de historial
│   │   ├── game-history.entity.ts
│   │   ├── game-history.controller.ts
│   │   ├── game-history.service.ts
│   │   └── game-history.module.ts
│   ├── config/              # Configuraciones
│   │   └── typeorm.config.ts
│   ├── app.module.ts        # Módulo principal
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts              # Punto de entrada
├── database/
│   └── schema.sql           # Schema de PostgreSQL
├── .env.example             # Variables de entorno ejemplo
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🎮 Juegos Disponibles

### 🎯 Ruleta (Roulette)

Tipos de apuesta:
- **number**: Apostar a un número específico (0-36) - Pago 35:1
- **color**: Apostar a rojo o negro - Pago 1:1
- **odd-even**: Apostar a par o impar - Pago 1:1
- **high-low**: Alto (19-36) o Bajo (1-18) - Pago 1:1

```json
{
  "gameType": "roulette",
  "amount": 100,
  "betType": "number",
  "value": 17
}
```

### 🎲 Dados (Dice)

Adivinar la suma de dos dados (2-12).

```json
{
  "gameType": "dice",
  "amount": 50,
  "prediction": 7
}
```

Pago: 6:1 por adivinar exacto

### 🎰 Tragamonedas (Slots)

Símbolos: 🍒 🍋 🍊 🍉 ⭐ 💎 7️⃣

Pagos:
- Tres 7️⃣: 50:1
- Tres 💎: 30:1
- Tres ⭐: 20:1
- Tres iguales: 10:1
- Dos iguales: 2:1

```json
{
  "gameType": "slots",
  "amount": 25
}
```

### 🃏 Blackjack

*(Pendiente de implementación completa)*

### 🎴 Póker

*(Pendiente de implementación completa)*

## 🔐 Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- Autenticación JWT
- Validación de datos con class-validator
- SQL injection protection con TypeORM
- CORS configurado
- Variables de entorno para secretos

## 📊 Base de Datos - Esquema

### Tabla: users

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| username | VARCHAR(50) | Único |
| first_name | VARCHAR(100) | Nombre |
| last_name | VARCHAR(100) | Apellido |
| email | VARCHAR(150) | Único |
| password | VARCHAR(255) | Hash bcrypt |
| balance | DECIMAL(10,2) | Saldo virtual |
| profile_picture | VARCHAR(255) | URL foto |
| is_active | BOOLEAN | Estado |
| role | VARCHAR(50) | player/admin |
| created_at | TIMESTAMP | Fecha creación |
| updated_at | TIMESTAMP | Última actualización |

### Tabla: transactions

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK a users |
| type | ENUM | bet/win/deposit/withdrawal |
| amount | DECIMAL(10,2) | Monto |
| balance_before | DECIMAL(10,2) | Saldo antes |
| balance_after | DECIMAL(10,2) | Saldo después |
| status | ENUM | pending/completed/failed |
| game_type | VARCHAR(100) | Tipo de juego |
| metadata | JSONB | Info adicional |
| created_at | TIMESTAMP | Fecha |

### Tabla: game_history

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | PK |
| user_id | UUID | FK a users |
| game_type | ENUM | roulette/poker/slots/blackjack/dice |
| bet_amount | DECIMAL(10,2) | Apuesta |
| win_amount | DECIMAL(10,2) | Ganancia |
| result | ENUM | win/loss/draw |
| balance_before | DECIMAL(10,2) | Saldo antes |
| balance_after | DECIMAL(10,2) | Saldo después |
| game_data | JSONB | Detalles del juego |
| duration | INTEGER | Duración en segundos |
| created_at | TIMESTAMP | Fecha |

## 🐳 Docker (Opcional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: casino_royal_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: admin
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      DB_HOST: postgres
    depends_on:
      - postgres

volumes:
  postgres_data:
```

## 🤝 Contribución

Este es un proyecto académico. Para contribuir:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto es parte del curso de Ingeniería de Software.

## 👥 Equipo

- **Aura Melina Gutiérrez Jiménez** - Project Manager
- **Jaime Contreras Barragán** - Tester / DB Engineer
- **César Guillermo Sainz Hinojosa** - Frontend Developer
- **Sofía López Ozuna** - Backend Developer

## 📧 Contacto

Para preguntas o soporte, contactar al equipo de desarrollo.

---

**Casino Royal** © 2024 - Proyecto Académico de Ingeniería de Software
