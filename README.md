# Casino Royal 🎰

Plataforma de casino en línea con Next.js y NestJS.

## Tecnologías

### Backend
- NestJS
- TypeScript
- PostgreSQL
- TypeORM
- JWT Authentication

### Frontend
- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Axios

## Configuración

### Backend

1. Instalar dependencias:
```bash
cd backend
npm install
```

2. Configurar base de datos con Docker:
```bash
docker-compose up -d
```

3. Ejecutar el servidor:
```bash
npm run start:dev
```

El backend corre en: `http://localhost:4000`

### Frontend

1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Ejecutar el servidor de desarrollo:
```bash
npm run dev
```

El frontend corre en: `http://localhost:3000`

## Estructura del Proyecto

```
Casino Royal/
├── backend/          # API NestJS
│   ├── src/
│   ├── database/
│   └── docker-compose.yml
└── frontend/         # App Next.js
    ├── app/          # Pages (App Router)
    ├── components/   # Componentes React
    ├── context/      # Context API
    └── lib/          # Services y utilidades
```

## Juegos Disponibles

- 🎡 **Ruleta**: Apuesta a números o colores
- 🎲 **Dados (Craps)**: Lanza los dados y gana
- 🎰 **Tragamonedas**: Prueba tu suerte

## API Endpoints

- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar usuario
- `GET /api/games` - Listar juegos
- `POST /api/games/roulette` - Jugar ruleta
- `POST /api/games/craps` - Jugar dados
- `POST /api/games/slots` - Jugar tragamonedas
- `GET /api/game-history` - Historial de juegos
- `GET /api/users/balance` - Consultar balance

## Variables de Entorno

### Backend (.env)
```
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=admin
DATABASE_NAME=casino_royal_db
JWT_SECRET=your_secret_key
PORT=4000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
