"""
Pydantic Schemas & Domain Models for BizNexus
"""

from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import date, datetime

# --- Dashboard Models ---
class KPICard(BaseModel):
    title: str
    value: str
    change: Optional[str] = None
    change_type: Optional[str] = "positive" # positive | negative | neutral
    accent: Optional[str] = "#2563eb"

class DashboardSummary(BaseModel):
    kpis: List[KPICard]
    ai_insight: str
    revenue_trend: List[Dict[str, Any]]
    sales_performance: List[Dict[str, Any]]
    lead_sources: List[Dict[str, Any]]
    lead_types: List[Dict[str, Any]]
    conversion_funnel: List[Dict[str, Any]]

# --- CRM Models ---
class Lead(BaseModel):
    id: str
    name: str
    company: str
    lead_type: str # Retailer | Wholesaler | Distributor | Business | Enterprise
    stage: str # NEW | CONTACTED | QUALIFIED | PROPOSAL | NEGOTIATION | WON | LOST
    potential_value: float
    potential_value_formatted: str
    source: str # Instagram | LinkedIn | Website | Sales Team | Facebook | Referral
    priority: str # High | Medium | Low
    assigned_to: str
    contact_person: str
    email: str
    phone: str
    location: str
    industry: str
    probability: int
    expected_close: str
    last_activity: str
    next_follow_up: str
    ai_insight: Optional[str] = None

class Customer(BaseModel):
    id: str
    name: str
    type: str # Retailer | Wholesaler | Distributor | Business | Enterprise
    contact_person: str
    email: str
    phone: str
    location: str
    orders_count: int
    total_revenue: float
    total_revenue_formatted: str
    outstanding: float
    outstanding_formatted: str
    status: str # Active | Inactive
    account_owner: str
    customer_since: str
    health_score: int
    ai_insight: Optional[str] = None

# --- ERP Models ---
class Product(BaseModel):
    id: str
    sku: str
    name: str
    category: str
    price: float
    cost: float
    stock: int
    reorder_level: int
    status: str # In Stock | Low Stock | Out of Stock
    supplier: str

class SalesOrder(BaseModel):
    id: str
    customer_name: str
    amount: float
    amount_formatted: str
    date: str
    payment_status: str # Paid | Pending | Partially Paid
    fulfillment_status: str # Delivered | Shipped | Processing | Confirmed | Draft
    items_count: int

# --- Finance Models ---
class Invoice(BaseModel):
    id: str
    customer_name: str
    amount: float
    amount_formatted: str
    issue_date: str
    due_date: str
    status: str # Paid | Pending | Partially Paid | Overdue

class Expense(BaseModel):
    id: str
    category: str
    amount: float
    date: str
    department: str
    submitted_by: str
    status: str

# --- Marketing Models ---
class SocialPost(BaseModel):
    id: str
    platform: str # Instagram | Facebook | LinkedIn
    title: str
    content: str
    reach: int
    likes: int
    clicks: int
    leads_generated: int
    qualified_leads: int
    conversions: int
    revenue_attributed: float
    status: str

# --- Documents & RAG Models ---
class DocumentItem(BaseModel):
    id: str
    name: str
    category: str
    size: str
    uploaded_by: str
    uploaded_date: str
    status: str # Indexed | Processing | Ready
    rag_indexed: bool = True

class RAGPipelineStage(BaseModel):
    step: int
    name: str
    technology: str
    description: str

# --- RBAC Models ---
class UserRecord(BaseModel):
    id: str
    name: str
    email: str
    role: str
    department: str
    access_scope: str
    status: str
    avatar: str

class UserOverride(BaseModel):
    user_id: str
    module: str
    permission: str
    granted: bool

# --- AI Models ---
class AIChatQuery(BaseModel):
    query: str
    role: Optional[str] = "Business Owner"

class AIChatResponse(BaseModel):
    content: str
    sources: List[str] = []
    type: str = "insight" # database | document | insight
    follow_ups: List[str] = []
