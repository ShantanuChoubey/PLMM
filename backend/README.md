# PLMM Backend — Sprint 1 (Foundation & Infrastructure)

Peer Learning & Mentor Matching Platform API foundation.

## Tech Stack

- Node.js + Express.js
- PostgreSQL (Neon) + Prisma ORM
- Security: Helmet, CORS, rate limiting
- Structured logging and global error handling

## Folder Structure

```
backend/
├── prisma/
│   └── schema.prisma
├── logs/
├── src/
│   ├── config/
│   ├── constants/
│   ├── controllers/
│   ├── database/
│   ├── middlewares/
│   ├── modules/
│   ├── repositories/
│   ├── routes/
│   │   └── v1/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
└── package.json
```

## Installation

```bash
cd backend
npm install
npx prisma generate
```

## Environment Setup

1. Copy the example env file:

```bash
cp .env.example .env
```

2. Update `.env` with your [Neon](https://neon.tech) PostgreSQL connection string:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB_NAME?sslmode=require"
```

3. Ensure all required variables are set:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default `5000`) |
| `NODE_ENV` | `development` or `production` |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `JWT_SECRET` | Min 32 characters (reserved for auth sprint) |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `CLIENT_URL` | Frontend origin for CORS (e.g. `http://localhost:5173`) |

## Database Connection

On startup, the server connects to PostgreSQL via Prisma.

- **Production:** A valid `DATABASE_URL` is required; the server exits if the connection fails.
- **Development:** If Neon is not configured yet, the server still starts with a warning so you can test routes (`/api/v1/health`, 404 handling). Set your Neon URL and run `npx prisma db push` to enable full database connectivity.


Push the placeholder schema to your Neon database:

```bash
npx prisma db push
```

Optional — open Prisma Studio:

```bash
npm run prisma:studio
```

## Run

Development (with auto-reload):

```bash
npm run dev
```

Production:

```bash
npm start
```

## API

Base URL: `http://localhost:5000/api/v1`

### Health Check

```http
GET /api/v1/health
```

Response:

```json
{
  "success": true,
  "message": "Server is healthy"
}
```

### 404 Example

```http
GET /api/v1/unknown
```

Response:

```json
{
  "success": false,
  "message": "Resource not found: /api/v1/unknown"
}
```

## Verification Checklist

```bash
# 1. Install & generate client
npm install && npx prisma generate

# 2. Push schema to Neon
npx prisma db push

# 3. Start server
npm run dev

# 4. Test health
curl http://localhost:5000/api/v1/health

# 5. Test 404
curl http://localhost:5000/api/v1/not-found
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start with Node watch mode |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:push` | Push schema to database |
| `npm run prisma:migrate` | Create migration (future sprints) |
| `npm run prisma:studio` | Open Prisma Studio |

## Architecture

- **Routes** → **Controllers** → **Services** → **Repositories**
- Global error handler + `AppError` class
- `asyncHandler` wrapper for async routes
- Centralized logger and response helpers
- API versioning under `/api/v1`

No authentication or business modules in Sprint 1.
