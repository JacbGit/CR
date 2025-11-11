# 🎰 CASINO ROYAL - GUÍA DE INSTALACIÓN RÁPIDA

## 📦 Contenido del Proyecto

El proyecto backend completo incluye:

### Estructura Principal
```
casino-royal-backend/
├── src/                      # Código fuente
│   ├── auth/                # Autenticación JWT
│   ├── users/               # Gestión de usuarios
│   ├── games/               # Lógica de juegos
│   ├── transactions/        # Sistema de transacciones
│   ├── game-history/        # Historial de partidas
│   └── config/              # Configuraciones
├── database/                # Scripts SQL
│   ├── schema.sql          # Esquema completo de BD
│   ├── seed.sql            # Datos de prueba
│   └── queries.sql         # Queries útiles
├── package.json            # Dependencias
├── .env.example           # Ejemplo de variables
├── docker-compose.yml     # Docker setup
└── README.md              # Documentación completa
```

## 🚀 INSTALACIÓN EN 5 PASOS

### Paso 1: Extraer el proyecto
```bash
tar -xzf casino-royal-backend.tar.gz
cd casino-royal-backend
```

### Paso 2: Instalar dependencias
```bash
npm install
```

### Paso 3: Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales
```

### Paso 4: Configurar PostgreSQL

**Opción A - Con Docker (Recomendado):**
```bash
docker-compose up -d
# Los scripts de inicialización se ejecutan automáticamente
# Esperar 10 segundos para que PostgreSQL inicie completamente
sleep 10
```

**Opción B - PostgreSQL Local (requiere psql instalado):**
```bash
# Crear base de datos
createdb -U postgres casino_royal_db

# Ejecutar scripts
psql -U postgres -d casino_royal_db -f database/schema.sql
psql -U postgres -d casino_royal_db -f database/seed.sql
```

**Nota para macOS:** Si no tienes `psql` instalado y quieres usar PostgreSQL local, instálalo con:
```bash
brew install postgresql@15
```

### Paso 5: Iniciar el servidor
```bash
npm run start:dev
```

El servidor estará en: **http://localhost:3000**

## 🗄️ TABLAS DE LA BASE DE DATOS

### Tabla: `users`
Almacena información de usuarios y jugadores.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK, Default: uuid_generate_v4() |
| username | VARCHAR(50) | Nombre de usuario | UNIQUE, NOT NULL |
| first_name | VARCHAR(100) | Nombre | NOT NULL |
| last_name | VARCHAR(100) | Apellido | NOT NULL |
| email | VARCHAR(150) | Correo electrónico | UNIQUE, NOT NULL |
| password | VARCHAR(255) | Contraseña hasheada | NOT NULL |
| profile_picture | VARCHAR(255) | URL foto de perfil | NULL |
| balance | DECIMAL(10,2) | Saldo virtual | DEFAULT 1000.00, CHECK >= 0 |
| is_active | BOOLEAN | Usuario activo | DEFAULT TRUE |
| role | VARCHAR(50) | Rol del usuario | DEFAULT 'player', CHECK IN ('player','admin') |
| created_at | TIMESTAMP | Fecha de creación | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | Última actualización | DEFAULT CURRENT_TIMESTAMP |

**Índices:**
- `idx_users_username` en username
- `idx_users_email` en email
- `idx_users_is_active` en is_active

---

### Tabla: `transactions`
Registra todas las transacciones financieras del sistema.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK |
| user_id | UUID | ID del usuario | FK → users(id), NOT NULL |
| type | ENUM | Tipo de transacción | 'bet','win','deposit','withdrawal' |
| amount | DECIMAL(10,2) | Monto | NOT NULL |
| balance_before | DECIMAL(10,2) | Saldo anterior | NOT NULL |
| balance_after | DECIMAL(10,2) | Saldo posterior | NOT NULL |
| status | ENUM | Estado | 'pending','completed','failed','cancelled' |
| game_type | VARCHAR(100) | Tipo de juego | NULL |
| game_history_id | UUID | ID de partida | NULL |
| description | VARCHAR(500) | Descripción | NULL |
| metadata | JSONB | Datos adicionales | NULL |
| created_at | TIMESTAMP | Fecha | DEFAULT CURRENT_TIMESTAMP |

**Índices:**
- `idx_transactions_user_id` en user_id
- `idx_transactions_type` en type
- `idx_transactions_game_type` en game_type
- `idx_transactions_created_at` en created_at (DESC)
- `idx_transactions_status` en status

---

### Tabla: `game_history`
Almacena el historial completo de todas las partidas jugadas.

| Campo | Tipo | Descripción | Restricciones |
|-------|------|-------------|---------------|
| id | UUID | Identificador único | PK |
| user_id | UUID | ID del jugador | FK → users(id), NOT NULL |
| game_type | ENUM | Tipo de juego | 'roulette','poker','slots','blackjack','dice' |
| bet_amount | DECIMAL(10,2) | Monto apostado | NOT NULL, CHECK > 0 |
| win_amount | DECIMAL(10,2) | Monto ganado | DEFAULT 0, CHECK >= 0 |
| result | ENUM | Resultado | 'win','loss','draw' |
| balance_before | DECIMAL(10,2) | Saldo antes | NOT NULL |
| balance_after | DECIMAL(10,2) | Saldo después | NOT NULL |
| game_data | JSONB | Detalles del juego | NULL |
| duration | INTEGER | Duración (segundos) | DEFAULT 0 |
| created_at | TIMESTAMP | Fecha de la partida | DEFAULT CURRENT_TIMESTAMP |

**Índices:**
- `idx_game_history_user_id` en user_id
- `idx_game_history_game_type` en game_type
- `idx_game_history_result` en result
- `idx_game_history_created_at` en created_at (DESC)
- `idx_game_history_user_game` en (user_id, game_type)

---

## 📊 VISTAS DISPONIBLES

### Vista: `user_statistics`
Estadísticas generales por usuario.
```sql
SELECT * FROM user_statistics WHERE username = 'jugador1';
```

### Vista: `game_statistics`
Estadísticas por tipo de juego.
```sql
SELECT * FROM game_statistics;
```

### Vista: `recent_transactions`
Últimas 100 transacciones del sistema.
```sql
SELECT * FROM recent_transactions LIMIT 20;
```

---

## 🎮 ENDPOINTS DE LA API

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/verify` - Verificar token

### Usuarios
- `GET /api/users/me` - Obtener perfil
- `PATCH /api/users/me` - Actualizar perfil
- `POST /api/users/me/change-password` - Cambiar contraseña

### Juegos
- `POST /api/games/roulette/play` - Jugar ruleta
- `POST /api/games/dice/play` - Jugar dados
- `POST /api/games/slots/play` - Jugar tragamonedas
- `GET /api/games/stats` - Estadísticas personales

### Historial
- `GET /api/game-history` - Ver historial completo
- `GET /api/game-history/recent` - Últimas partidas
- `GET /api/game-history/game/:gameType` - Por tipo de juego
- `GET /api/game-history/game/:gameType/stats` - Estadísticas por juego

### Transacciones
- `GET /api/transactions` - Ver transacciones
- `GET /api/transactions/summary` - Resumen financiero

---

## 🧪 USUARIOS DE PRUEBA

Todos los usuarios tienen la contraseña: **Test123**

| Username | Email | Balance | Role |
|----------|-------|---------|------|
| admin | admin@casino.com | 10000.00 | admin |
| jugador1 | juan@example.com | 1500.00 | player |
| jugador2 | maria@example.com | 2000.00 | player |
| jugador3 | carlos@example.com | 800.00 | player |

---

## 📝 EJEMPLO DE USO

### 1. Registrar un usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "nuevoUsuario",
    "firstName": "Nuevo",
    "lastName": "Usuario",
    "email": "nuevo@example.com",
    "password": "Password123"
  }'
```

### 2. Iniciar sesión
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jugador1",
    "password": "Test123"
  }'
```

Guarda el `access_token` de la respuesta.

### 3. Jugar a la ruleta
```bash
curl -X POST http://localhost:3000/api/games/roulette/play \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "gameType": "roulette",
    "amount": 50,
    "betType": "color",
    "value": "red"
  }'
```

### 4. Ver historial
```bash
curl http://localhost:3000/api/game-history/recent \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🔧 COMANDOS ÚTILES

```bash
# Ver logs del servidor
npm run start:dev

# Ejecutar tests
npm run test

# Ver base de datos con pgAdmin
# Abrir: http://localhost:5050
# User: admin@casino.com
# Pass: admin123

# Conectar a PostgreSQL
psql -h localhost -U postgres -d casino_royal_db

# Ver todas las tablas
\dt

# Ver usuarios
SELECT username, balance FROM users;

# Ver últimas partidas
SELECT * FROM game_history ORDER BY created_at DESC LIMIT 10;
```

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Error: "Database connection failed"
```bash
# Verificar que PostgreSQL esté corriendo
docker-compose ps
# o
sudo systemctl status postgresql
```

### Error: "Port 3000 already in use"
```bash
# Cambiar puerto en .env
PORT=3001
```

### Error: "JWT secret not configured"
```bash
# Asegurar que .env tiene JWT_SECRET
echo 'JWT_SECRET=tu_secreto_aqui' >> .env
```

---

## 📚 CONSULTAS SQL ÚTILES

Ver archivo `database/queries.sql` para más de 30 queries útiles incluyendo:
- Estadísticas de jugadores
- Rankings
- Análisis de juegos
- Reportes financieros
- Consultas de mantenimiento

---

## 🎯 PRÓXIMOS PASOS

1. ✅ Backend completamente funcional
2. 🔄 Integrar con Frontend React
3. 🎴 Implementar Blackjack completo
4. 🎴 Implementar Póker completo
5. 💳 Integrar pasarela de pago (Stripe/PayPal)
6. 📊 Dashboard de administrador
7. 🔔 Sistema de notificaciones en tiempo real

---

## 📞 SOPORTE

Para dudas o problemas:
- Revisar README.md completo
- Consultar database/queries.sql
- Verificar logs del servidor

---

**Casino Royal** © 2024
Proyecto desarrollado con ❤️ por el equipo de Casino Royal
