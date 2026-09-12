from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import router
from app.config.settings import settings

from app.database.init_db import init_db

from app.websocket.websocket import router as websocket_router

from app.simulator.truck_simulator import start_simulator

from app.api.routes import map
from app.api.routes import route_history


# =========================================================
# APPLICATION LIFESPAN
# =========================================================

@asynccontextmanager
async def lifespan(app: FastAPI):

    # ==========================
    # Startup
    # ==========================

    print("🚀 Starting StreamForge...")

    # Initialize database tables
    init_db()

    print("✅ Database initialized successfully.")

    # Start truck simulator
    start_simulator()

    print("🚚 Truck Simulator started.")

    yield

    # ==========================
    # Shutdown
    # ==========================

    print("🛑 Shutting down StreamForge...")


# =========================================================
# FASTAPI APPLICATION
# =========================================================

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)


# =========================================================
# CORS CONFIGURATION
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# MAIN API ROUTES
# =========================================================

app.include_router(router)


# =========================================================
# WEBSOCKET ROUTES
# =========================================================

app.include_router(websocket_router)


# =========================================================
# FLEET MAP ROUTES
# =========================================================

app.include_router(
    map.router
)


# =========================================================
# ROUTE HISTORY ROUTES
# =========================================================

app.include_router(
    route_history.router
)


# =========================================================
# ROOT ENDPOINT
# =========================================================

@app.get("/")
async def home():

    return {
        "project": settings.APP_NAME,
        "version": settings.VERSION,
        "status": "Running",
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
async def health():

    return {
        "status": "Healthy",
        "service": settings.APP_NAME,
    }