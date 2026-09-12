from fastapi import APIRouter

from app.api.routes import (
    auth,
    truck,
    dashboard,
    alerts,
    users,
    analytics,
    notifications,
)

from app.api.routes.geofences import (
    router as geofence_router,
)


# =========================================================
# MAIN API ROUTER
# =========================================================

router = APIRouter()


# =========================================================
# API ROUTES
# =========================================================

router.include_router(auth.router)

router.include_router(truck.router)

router.include_router(dashboard.router)

router.include_router(alerts.router)

router.include_router(notifications.router)

router.include_router(users.router)

router.include_router(analytics.router)

router.include_router(geofence_router)