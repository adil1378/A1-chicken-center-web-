from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.v1.health import router as health_router


def create_app() -> FastAPI:
    """Application factory for A1 Chicken Center FastAPI backend."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description="Official API for A1 Chicken Center Platform",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else [settings.CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Health check endpoints: direct /health and versioned /api/v1/health
    app.include_router(health_router)
    app.include_router(health_router, prefix="/api/v1")

    @app.get("/")
    def root():
        return {
            "message": "Welcome to A1 Chicken Center API",
            "docs": "/docs",
            "health": "/health",
            "version": settings.VERSION,
        }

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
