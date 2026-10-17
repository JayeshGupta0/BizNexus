"""
BizNexus Backend Configuration
"""

import os
from pydantic import BaseModel

class Settings(BaseModel):
    PROJECT_NAME: str = "BizNexus Intelligent Business Platform"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "*"
    ]
    
    # Tech Stack References (SDG 9 & Academic Spec)
    DATABASE_TYPE: str = "SQLite (biznexus.db)"
    RAG_ORCHESTRATOR: str = "LangChain"
    VECTOR_DB: str = "ChromaDB"
    DOCUMENT_PARSER: str = "PyPDF"
    AI_ENGINE: str = "ChatGPT / OpenAI API"

settings = Settings()
