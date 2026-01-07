# GoComet Project — Documentation

## Overview

GoComet is a full-stack web application demonstrating a React frontend with a Node.js (Express) backend. The project implements RESTful APIs, a modular backend structure, and patterns for scalability and maintainability. It includes caching/locking support via Redis and persistent storage in a relational database.

## Tech Stack

- Frontend: React
- Backend: Node.js, Express
- Database: MySQL
- Cache / Locking: Redis
- Package manager: npm

## Architecture

The system follows a typical web-app architecture:

- Clients (browser) ↔ Frontend (React)
- Frontend → Backend (Express REST API)
- Backend → Database (SQL)
- Backend ↔ Redis (caching, locks, ephemeral state)

See the Low-Level Design image at `assets/lld-diagram.png` for component interactions.

## Setup (Quickstart)

Clone the repository and change into the project folder:

```bash
git clone https://github.com/lokeshgarg16/gocomet-project.git
cd gocomet-project
```

Frontend:

```bash
cd frontend
npm install
npm run start
```

Backend:

```bash
cd cargo-backend
npm install
node server.js
```

Default ports used in this project:

- Frontend: `http://localhost:3000`
- Backend: e.g., `http://localhost:5000` (check `server.js` for configuration)

## Project Structure

- `frontend/` — React app and UI components
- `cargo-backend/` — Express server, controllers, routes, models
  - `controllers/` — business logic
  - `routes/` — API route definitions
  - `models/` — data models and DB-layer code
  - `config/` — DB and Redis configuration (`db.js`, `redis.js`)
  - `middleware/` — utilities like `lockManager.js`
  - `services/` — helper services such as `routeService.js`
- `assets/` — diagrams and images referenced by docs

Refer to `README.md` for the quick project overview and the `cargo-backend` code for concrete route and controller implementations.

## Database Design

The project uses a relational model suitable for bookings and flights (one-to-many and many-to-many relationships). Typical entities include:

- `Flight` — flight details and schedule
- `Booking` — user booking records linked to flights
- `EventLog` — audit or event stream for state changes

Use the diagram in `assets/db-design.png` (replace the placeholder) for the exact schema.

## Low-Level Design (LLD)

The LLD illustrates how requests flow through the API into business logic, caching, and persistent storage. A common pattern used in the project:

1. API route receives HTTP request
2. Controller validates and coordinates use-cases
3. Controller calls services / models
4. Models interact with SQL database (CRUD) and Redis (cache / locks)
5. Controller returns response to frontend

Refer to `assets/lld-diagram.png` for a visual representation.

## Running & Development Tips

- Environment variables: configure DB connection string, Redis URL, and server port in `cargo-backend/config` or via environment variables.
- Use Redis locally during development if `lockManager.js` is required by controllers.
- If switching DB engines (MySQL, Postgres), update the DB client/ORM configuration in `cargo-backend/config/db.js` and any ORM initialization.

Commands summary:

```bash
# frontend
cd frontend
npm install
npm run start

# backend
cd cargo-backend
npm install
node server.js
```

## Why React + Node + Express + SQL was chosen

Rationale summary:

- Single language across stack: Using JavaScript across frontend and backend (React, Node, Express) provides a consistent development experience and shared tooling. Using Node/Express with React keeps developer experience consistent (same language, shared utility code, shared validation logic patterns).

- React for rich UX: React provides a component-based UI model that is ideal for building an interactive booking dashboard, tracking timeline, and stateful UI elements.

- Node/Express for lightweight APIs: Node with Express is a natural fit for writing REST endpoints, integrating middleware (authentication, logging, rate limiting), and connecting to caching layers like Redis.

- SQL instead of NoSQL (why SQL was chosen here):
  - Relational integrity: Booking and flight domains are highly relational (bookings reference flights, seats, users). SQL databases provide strong referential integrity and ACID guarantees, which simplify correctness for financial/booking operations.
  - Complex queries & reporting: SQL excels at joins, aggregates, and reporting queries that are common in travel and booking systems (availability, revenue reports, occupancy metrics).
  - Transactions: Booking flows often require multi-step updates that must be atomic (reserve seat, update availability, write booking). SQL transactions simplify implementing these safely.
  - Maturity & tooling: RDBMSes like PostgreSQL and MySQL have mature tooling for backups, migrations, analytics, and proven performance for relational workloads.

## API Endpoints

See `cargo-backend/routes` for the concrete API endpoints (for example, booking-related routes are under `bookingRoutes.js`). Typical endpoints include:

- `GET /api/flights` — list or search flights
- `GET /api/flights/:id` — flight details
- `POST /api/bookings` — create a booking
- `GET /api/bookings/:id` — booking details

Adjust paths based on `cargo-backend/routes/*.js` implementations.

---