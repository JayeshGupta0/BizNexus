import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router as api_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Unified CRM + ERP + Marketing + Business Analytics + RAG Intelligence Backend",
)

# CORS Middleware to support frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router under /api
app.include_router(api_router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "online",
        "docs_url": "/docs",
        "tech_stack": {
            "frontend": "React, Recharts, Vite, Tailwind CSS",
            "backend": "Python, FastAPI",
            "database": settings.DATABASE_TYPE,
            "vector_store": settings.VECTOR_DB,
            "ai_rag": f"{settings.RAG_ORCHESTRATOR} + {settings.AI_ENGINE}",
            "document_processor": settings.DOCUMENT_PARSER
        }
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "timestamp": "2026-09-04T13:30:00Z",
        "environment": settings.ENVIRONMENT
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
