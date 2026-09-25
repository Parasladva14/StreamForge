# 🚚 StreamForge — Real-Time Fleet Monitoring System

StreamForge is a full-stack fleet monitoring and telemetry platform for tracking commercial vehicles in real-time. It provides live GPS tracking, temperature monitoring, geofence management, automated alerts, and comprehensive analytics — all powered by WebSocket real-time updates and an Apache Kafka streaming pipeline.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Running the Application](#running-the-application)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [WebSocket Channels](#websocket-channels)
- [Kafka Streaming Pipeline](#kafka-streaming-pipeline)
- [Simulator](#simulator)
- [Database](#database)
- [Authentication & RBAC](#authentication--rbac)
- [Testing](#testing)
- [Demo Flow](#demo-flow)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

## Overview

StreamForge monitors a fleet of trucks in real time, simulating GPS movement, temperature fluctuations, and geofence enter/exit events. It is designed for logistics operations that need:

- **Live vehicle tracking** on an interactive map
- **Temperature monitoring** with threshold-based alerts
- **Geofence management** with automatic entry/exit detection
- **Real-time notifications** via WebSocket
- **Analytics and reporting** with CSV/PDF export
- **Role-based access control** (Admin, Operator, Viewer)

---

## Key Features

| Module | Description |
|--------|-------------|
| **Dashboard** | Fleet overview with KPI cards (total trucks, avg temperature, alerts), temperature charts, recent truck table |
| **Truck CRUD** | Create, read, update, delete trucks with search and validation |
| **Fleet Map** | Interactive Leaflet map with real-time markers, status indicators, truck details panel |
| **Geofencing** | Full CRUD for circular geofences with Haversine-based enter/exit detection |
| **Notifications** | Real-time notification system with unread count, mark read, mark all read, filtering |
| **Analytics** | Temperature trends, distribution charts, fleet status breakdown |
| **Reports** | Data tables with filters, sorting, pagination, CSV/PDF export |
| **Route History** | Historical route playback with statistics (simulated data) |
| **Alerts** | Automated temperature threshold alerts persisted to database |
| **Admin Panel** | User management for Admin role |
| **Settings** | Fleet thresholds, simulator controls, profile and system status |

---

## Tech Stack

### Frontend
- **React 19** with Vite 8
- **React Router** v7 for client-side routing
- **Axios** for HTTP requests
- **Leaflet / React Leaflet** for interactive maps
- **Recharts / Chart.js** for analytics visualization
- **jsPDF + jspdf-autotable** for PDF export
- **XLSX** for CSV export
- **React Toastify** for toast notifications

### Backend
- **Python 3.11+** with **FastAPI**
- **SQLAlchemy 2.0** ORM with MySQL
- **Pydantic v2** for request/response validation
- **JWT (python-jose)** for authentication
- **Passlib + bcrypt** for password hashing
- **WebSocket** via FastAPI native support

### Streaming & Infrastructure
- **Apache Kafka** (Confluent) for event streaming
- **Kafka Producer/Consumer** with resilient fallback
- **Bytewax** stream processor (TemperatureAggregator)
- **Docker Compose** for MySQL, Kafka, and Zookeeper
- **MySQL 8** as the primary database

---

## Architecture

```
┌──────────────┐     HTTP/WS      ┌──────────────┐     SQL       ┌─────────┐
│   React UI   │ ◄──────────────► │   FastAPI    │ ◄───────────► │  MySQL  │
│   (Vite)     │                  │   Backend    │               │   8.0   │
└──────────────┘                  └──────┬───────┘               └─────────┘
                                         │
                                    ┌────┴────┐
                                    │Simulator│
                                    └────┬────┘
                                         │ Kafka Producer
                                    ┌────▼────┐
                                    │  Kafka  │
                                    │  Broker │
                                    └────┬────┘
                                         │ Consumer
                                    ┌────▼────────┐
                                    │   Bytewax   │
                                    │  Processor  │
                                    └─────────────┘
```

**Data Flow:**
1. Simulator generates truck telemetry every 6 seconds
2. Updates are written to MySQL and broadcast via WebSocket
3. Events are published to Kafka topic `truck-temperature`
4. Kafka consumer and Bytewax stream processor aggregate data
5. Frontend receives real-time updates and refreshes UI

---

## Project Structure

```
StreamForge/
├── backend/
│   ├── app/
│   │   ├── api/              # FastAPI routers
│   │   │   ├── router.py     # Central route registry
│   │   │   └── routes/       # auth, truck, map, dashboard, alerts,
│   │   │                     # analytics, notifications, geofences,
│   │   │                     # route_history, users
│   │   ├── config/           # Settings (env-based)
│   │   ├── database/         # SQLAlchemy engine, session, init/seed
│   │   ├── dependencies/     # RBAC role checker
│   │   ├── kafka/            # Producer, consumer, config
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── schemas/          # Pydantic request/response schemas
│   │   ├── security/         # JWT token + password hashing
│   │   ├── services/         # Business logic layer
│   │   ├── simulator/        # Background truck simulator
│   │   ├── stream/           # Bytewax stream processor
│   │   ├── tests/            # pytest test suite (76 tests)
│   │   ├── websocket/        # WebSocket manager + routes
│   │   ├── workers/          # Kafka worker entry point
│   │   └── main.py           # FastAPI app entry point
│   ├── Dockerfile
│   ├── requirements.txt
│   └── pytest.ini
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios instance with interceptors
│   │   ├── components/       # Reusable UI components
│   │   ├── context/          # Auth and Theme contexts
│   │   ├── hooks/            # Custom hooks (WebSocket, dashboard, etc.)
│   │   ├── layouts/          # MainLayout with sidebar/navbar
│   │   ├── pages/            # Page components (Dashboard, Trucks, etc.)
│   │   ├── routes/           # React Router config + ProtectedRoute
│   │   ├── services/         # API service modules
│   │   ├── styles/           # Global CSS + design tokens
│   │   └── utils/            # Helpers, constants, export utilities
│   ├── Dockerfile
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml        # MySQL, Kafka, Zookeeper, Backend, Frontend
├── .env.example
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** 18+ and **npm** 9+
- **Python** 3.11+
- **MySQL** 8.0 (or use Docker)
- **Docker** and **Docker Compose** (optional, for Kafka/MySQL)

### Environment Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Parasladva14/StreamForge.git
   cd StreamForge
   ```

2. **Backend environment:**
   ```bash
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MySQL credentials
   ```

3. **Frontend environment:**
   ```bash
   cp frontend/.env.example frontend/.env
   # Default values work for local development
   ```

---

## Running the Application

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The backend starts at `http://localhost:8000`.
API docs available at `http://localhost:8000/docs`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at `http://localhost:5173`.

---

## Docker Setup

Start infrastructure services (MySQL, Kafka, Zookeeper):

```bash
docker compose up -d mysql zookeeper kafka
```

Or run the full stack:

```bash
docker compose up -d
```

Verify services:
```bash
docker compose ps
docker compose logs backend
```

**Service ports:**
| Service | Port |
|---------|------|
| MySQL | 3306 |
| Kafka (external) | 29092 |
| Zookeeper | 2181 |
| Backend API | 8000 |
| Frontend | 5173 |

---

## API Documentation

FastAPI auto-generates interactive API docs:
- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

### Key Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login (returns JWT) |
| POST | `/auth/register` | Register new user |
| GET | `/auth/me` | Current user profile |
| GET | `/truck/` | List all trucks |
| POST | `/truck/` | Create truck (Admin) |
| PUT | `/truck/{id}` | Update truck |
| DELETE | `/truck/{id}` | Delete truck (Admin) |
| GET | `/trucks/locations` | Fleet map locations |
| GET | `/dashboard/` | Dashboard stats |
| GET | `/notifications` | All notifications |
| GET | `/notifications/unread` | Unread notifications |
| PATCH | `/notifications/{id}/read` | Mark read |
| PATCH | `/notifications/read-all` | Mark all read |
| GET | `/geofences` | List geofences |
| POST | `/geofences` | Create geofence |
| PUT | `/geofences/{id}` | Update geofence |
| DELETE | `/geofences/{id}` | Delete geofence (Admin) |
| GET | `/analytics/summary` | Analytics summary |
| GET | `/analytics/temperature-trend` | Temperature trend |
| GET | `/route/{truck_id}` | Route history |
| GET | `/alerts/` | List alerts |
| GET | `/health` | Health check |

---

## WebSocket Channels

All WebSocket URLs are configurable via `VITE_WS_URL` environment variable.

| Channel | Path | Description |
|---------|------|-------------|
| General | `/ws` | All events (truck updates, alerts, geofence events) |
| Trucks | `/ws/trucks` | Truck-specific location/status updates |
| Notifications | `/ws/notifications` | Real-time notification delivery |

**Event types broadcast:**
- `truck_updated` — Truck location/temperature change
- `truck_created` / `truck_deleted` — CRUD events
- `alert_created` — Temperature threshold breach
- `geofence_event` — Geofence enter/exit detection

---

## Kafka Streaming Pipeline

**Topic:** `truck-temperature`

**Pipeline:**
```
Simulator → Kafka Producer → truck-temperature topic → Consumer → Bytewax Processor
```

- **Producer** (`app/kafka/producer.py`): Publishes truck telemetry on each simulator tick
- **Consumer** (`app/kafka/consumer.py`): Consumes and processes events
- **Stream Processor** (`app/stream/processor.py`): Bytewax-based TemperatureAggregator

> **Note:** Kafka is optional. The application starts and functions fully without Kafka. The producer gracefully falls back to logging when Kafka is unavailable.

---

## Simulator

The truck simulator (`app/simulator/truck_simulator.py`) runs as an asyncio background task and executes every **6 seconds**:

1. **Moves active trucks** with subtle GPS coordinate changes
2. **Simulates temperature** fluctuations (15°C – 62°C range)
3. **Checks geofence boundaries** using Haversine distance
4. **Creates alerts** when temperature exceeds thresholds (45°C warning, 50°C critical)
5. **Creates notifications** for alerts and geofence events
6. **Broadcasts updates** via WebSocket to all connected clients
7. **Publishes events** to Kafka topic

> **Note:** All truck telemetry data (GPS coordinates, temperature, speed) is **simulated** for demonstration purposes.

---

## Database

**Engine:** MySQL 8.0 via SQLAlchemy 2.0

### Models

| Model | Table | Description |
|-------|-------|-------------|
| `User` | `users` | Authentication (email, password hash, role) |
| `Truck` | `trucks` | Fleet vehicles (id, driver, location, lat/lng, speed, fuel, temp, status) |
| `Alert` | `alerts` | Temperature threshold alerts |
| `Geofence` | `geofences` | Geographic monitoring zones (circle type) |
| `Notification` | `notifications` | System notifications |
| `Dashboard` | `dashboard` | Dashboard aggregation data |

### Auto-Migration

On startup, `init_db()` automatically:
- Creates tables via `Base.metadata.create_all()`
- Adds missing columns to existing tables (latitude, longitude, speed, fuel, updated_at)
- Seeds default demo data (users, trucks, geofences, notifications) if tables are empty

---

## Authentication & RBAC

| Role | Permissions |
|------|-------------|
| **Admin** | Full access: CRUD all resources, user management, delete operations |
| **Operator** | Read + Create + Update trucks, geofences, notifications |
| **Viewer** | Read-only access to all data |

**Default credentials:**
- These are only seeded if the users table is empty on first run
- Admin: `admin@streamforge.com` / `admin123`

**JWT Configuration:**
- Token expiry: configurable via `ACCESS_TOKEN_EXPIRE_MINUTES`
- Algorithm: HS256
- Stored in localStorage on frontend

---

## Testing

### Backend Tests

```bash
cd backend
python -m pytest -q
```

**76 tests** covering:
- Authentication (login, register, JWT, RBAC)
- Truck CRUD operations
- Dashboard service
- Notification service
- Geofence service
- Analytics service
- Kafka/Stream processing

### Frontend Build Verification

```bash
cd frontend
npm run build
npm run lint
```

### Python Compilation Check

```bash
cd backend
python -m compileall app -q
```

---

## Demo Flow

1. **Login** → Use admin credentials or register a new account
2. **Dashboard** → View fleet KPIs, temperature chart, recent trucks
3. **Trucks** → Add/edit/delete trucks, search and filter
4. **Fleet Map** → See live truck positions, click markers for details
5. **WebSocket** → Watch real-time temperature and location updates
6. **Analytics** → View temperature trends, distribution, fleet stats
7. **Reports** → Filter, sort, paginate data; export CSV/PDF
8. **Notifications** → View alerts, mark read, filter by type
9. **Geofences** → Create/edit/delete geofences, watch enter/exit alerts
10. **Route History** → Select truck, view historical route, playback
11. **Admin Panel** → Manage users (Admin role only)
12. **Settings** → Configure thresholds, simulator, profile
13. **Logout** → Clears JWT and redirects to login

---

## Known Limitations

1. **Simulated Data** — All GPS coordinates, temperature, and speed data is generated by the built-in simulator, not from real vehicles.
2. **Route History** — Route data is simulated; there is no persistent telemetry recording table.
3. **Geofence Type** — Only circular geofences are supported (polygon is planned).
4. **Geofence State** — Geofence enter/exit tracking uses in-memory state in the detector, which resets on server restart.
5. **Kafka Optional** — Kafka producer gracefully degrades if Kafka is unavailable. The application works without it.
6. **Single Node** — Designed for single-server deployment. No horizontal scaling support.

---

## Future Improvements

- [ ] Persistent telemetry recording for true historical playback
- [ ] Polygon geofence support with map drawing tools
- [ ] Real GPS device integration via MQTT/HTTP ingestion
- [ ] Push notifications (browser/mobile)
- [ ] Fleet analytics dashboard with heatmaps
- [ ] Multi-tenant support
- [ ] Horizontal scaling with Redis pub/sub
- [ ] Alerting rules engine with configurable thresholds per truck
- [ ] Mobile-responsive design improvements
- [ ] CI/CD pipeline with GitHub Actions

---

## License

This project is for educational and demonstration purposes.

---

**Built with ❤️ using FastAPI + React + Kafka**
