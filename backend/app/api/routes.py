"""
FastAPI Routes for BizNexus Prototype
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.schemas import (
    DashboardSummary, Lead, Customer, Product, SalesOrder,
    Invoice, SocialPost, DocumentItem, UserRecord, UserOverride,
    AIChatQuery, AIChatResponse
)
from app.services.mock_db import (
    MOCK_KPIS, MOCK_REVENUE_TREND, MOCK_LEADS, MOCK_CUSTOMERS,
    MOCK_PRODUCTS, MOCK_ORDERS, MOCK_INVOICES, MOCK_SOCIAL_POSTS,
    MOCK_DOCUMENTS, MOCK_USERS, MOCK_USER_OVERRIDES, MOCK_QUOTATIONS
)
from app.services.rag_service import rag_service

router = APIRouter()

# --- Dashboard ---
@router.get("/dashboard", response_model=Dict[str, Any])
def get_dashboard():
    return {
        "kpis": MOCK_KPIS,
        "ai_insight": "Revenue increased 18.4% this month, primarily driven by distributor and enterprise sales.",
        "revenue_trend": MOCK_REVENUE_TREND,
        "top_customers": MOCK_CUSTOMERS[:2],
        "top_products": MOCK_PRODUCTS[:3],
        "recent_orders": MOCK_ORDERS[:3]
    }

# --- CRM: Leads & Customers ---
@router.get("/crm/leads", response_model=List[Dict[str, Any]])
def get_leads():
    return MOCK_LEADS

@router.get("/crm/leads/{lead_id}", response_model=Dict[str, Any])
def get_lead_detail(lead_id: str):
    for lead in MOCK_LEADS:
        if lead["id"] == lead_id:
            return lead
    raise HTTPException(status_code=404, detail="Lead not found")

@router.get("/crm/customers", response_model=List[Dict[str, Any]])
def get_customers():
    return MOCK_CUSTOMERS

@router.get("/crm/customers/{customer_id}", response_model=Dict[str, Any])
def get_customer_detail(customer_id: str):
    for cust in MOCK_CUSTOMERS:
        if cust["id"] == customer_id:
            return cust
    raise HTTPException(status_code=404, detail="Customer not found")

# --- CRM: Quotations ---
@router.get("/crm/quotations", response_model=List[Dict[str, Any]])
def get_quotations():
    return MOCK_QUOTATIONS

# --- ERP: Orders & Products ---
@router.get("/erp/orders", response_model=List[Dict[str, Any]])
def get_orders():
    return MOCK_ORDERS

@router.get("/erp/products", response_model=List[Dict[str, Any]])
def get_products():
    return MOCK_PRODUCTS

# --- Finance: Invoices ---
@router.get("/finance/invoices", response_model=List[Dict[str, Any]])
def get_invoices():
    return MOCK_INVOICES

# --- Marketing: Social Content ---
@router.get("/marketing/social", response_model=List[Dict[str, Any]])
def get_social_posts():
    return MOCK_SOCIAL_POSTS

# --- Intelligence: Documents & RAG Architecture ---
@router.get("/documents", response_model=List[Dict[str, Any]])
def get_documents():
    return MOCK_DOCUMENTS

@router.get("/rag/architecture", response_model=List[Dict[str, Any]])
def get_rag_architecture():
    return rag_service.get_pipeline_architecture()

# --- Intelligence: AI Assistant ---
@router.post("/ai/chat", response_model=AIChatResponse)
def chat_ai(payload: AIChatQuery):
    return rag_service.process_query(payload.query)

# --- Admin: RBAC & User Overrides ---
@router.get("/rbac/users", response_model=List[Dict[str, Any]])
def get_rbac_users():
    return MOCK_USERS

@router.get("/rbac/overrides", response_model=List[Dict[str, Any]])
def get_rbac_overrides():
    return MOCK_USER_OVERRIDES
