"""
Auth & RBAC API Router for BizNexus
Endpoints:
  POST /api/auth/register   — company + owner account creation
  POST /api/auth/login      — credential-based login, returns user+company info
  POST /api/auth/add-user   — admin adds a user to their company
  GET  /api/auth/company/{company_id}/users — list all users in a company
  POST /api/auth/permissions/role           — save role-level permissions
  POST /api/auth/permissions/user           — save user-level permission overrides
  GET  /api/auth/permissions/{company_id}   — fetch all saved permissions
"""

import uuid
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from app.services.database import (
    create_company, create_user, authenticate_user,
    get_company_users, get_company, email_exists,
    upsert_role_permission, upsert_user_permission,
    get_all_permissions_for_company, get_user_by_id,
    update_user, delete_user,
    create_customer, bulk_create_customers,
    get_company_customers, update_customer, delete_customer,
)

auth_router = APIRouter(prefix="/auth", tags=["Authentication & RBAC"])

# ─── Pydantic Models ──────────────────────────────────────────────────────────

class RegisterPayload(BaseModel):
    # Owner
    owner_name: str
    owner_email: str
    owner_phone: str = ""
    owner_designation: str = "Managing Director"
    password: str
    # Company
    company_name: str
    trading_name: str = ""
    industry: str
    company_size: str = ""
    website: str = ""
    address: str = ""
    city: str = ""
    state: str = ""
    country: str = "India"
    pincode: str = ""
    # Modules & Roles
    selected_modules: List[str] = []
    enabled_roles: List[str] = ["Business Owner"]


class LoginPayload(BaseModel):
    email: str
    password: str


class AddUserPayload(BaseModel):
    company_id: str
    first_name: str
    last_name: str
    email: str
    password: str
    role: str
    department: str = ""


class UpdateUserPayload(BaseModel):
    company_id: str
    first_name: str
    last_name: str
    email: str
    role: str
    department: str = ""
    password: Optional[str] = None



class RolePermissionPayload(BaseModel):
    company_id: str
    role: str
    module: str
    view: bool = False
    create: bool = False
    edit: bool = False
    delete: bool = False
    export: bool = False
    approve: bool = False


class UserPermissionPayload(BaseModel):
    company_id: str
    user_id: str
    module: str
    view: bool = False
    create: bool = False
    edit: bool = False
    delete: bool = False
    export: bool = False
    approve: bool = False


class BulkRolePermissionsPayload(BaseModel):
    company_id: str
    permissions: List[RolePermissionPayload]


class BulkUserPermissionsPayload(BaseModel):
    company_id: str
    overrides: List[UserPermissionPayload]


# ─── Routes ───────────────────────────────────────────────────────────────────

@auth_router.get("/check-email")
def check_email(email: str):
    """Check if an email already exists in the system."""
    clean_email = email.strip().lower()
    exists = email_exists(clean_email)
    return {"email": clean_email, "exists": exists, "available": not exists}


@auth_router.post("/register")
def register(payload: RegisterPayload):
    """Register a new company and create the owner account."""
    # Check email uniqueness
    if email_exists(payload.owner_email):
        raise HTTPException(status_code=409, detail="An account with this email already exists")

    if len(payload.password) < 6:
        raise HTTPException(status_code=422, detail="Password must be at least 6 characters")

    # Ensure dashboard + users-roles + settings are always in selected_modules
    modules = list(payload.selected_modules)
    for required in ["dashboard", "users-roles", "settings"]:
        if required not in modules:
            modules.append(required)

    # Create company
    company_id = create_company({
        "company_name": payload.company_name,
        "trading_name": payload.trading_name or payload.company_name,
        "industry": payload.industry,
        "company_size": payload.company_size,
        "website": payload.website,
        "address": payload.address,
        "city": payload.city,
        "state": payload.state,
        "country": payload.country,
        "pincode": payload.pincode,
        "owner_name": payload.owner_name,
        "owner_designation": payload.owner_designation,
        "owner_phone": payload.owner_phone,
        "selected_modules": modules,
        "enabled_roles": payload.enabled_roles,
    })

    # Create owner user
    name_parts = payload.owner_name.strip().split()
    first = name_parts[0] if name_parts else payload.owner_name
    last = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""
    user_id = create_user({
        "company_id": company_id,
        "email": payload.owner_email,
        "password": payload.password,
        "first_name": first,
        "last_name": last,
        "role": "Business Owner",
        "department": "Executive Leadership",
        "is_owner": True,
    })

    company = get_company(company_id)
    user = get_user_by_id(user_id)

    return {
        "success": True,
        "message": "Company and owner account created successfully",
        "company_id": company_id,
        "user_id": user_id,
        "user": {
            "id": user["id"],
            "name": payload.owner_name,
            "email": user["email"],
            "role": "Business Owner",
            "department": "Executive Leadership",
            "avatar": user["avatar"],
            "is_owner": True,
            "company_id": company_id,
        },
        "company": {
            "id": company["id"],
            "name": company["name"],
            "trading_name": company["trading_name"],
            "industry": company["industry"],
            "company_size": company["company_size"],
            "website": company["website"],
            "city": company["city"],
            "state": company["state"],
            "country": company["country"],
            "owner_name": company["owner_name"],
            "owner_designation": company["owner_designation"],
            "selected_modules": company["selected_modules"],
            "enabled_roles": company["enabled_roles"],
            "tenant_id": company["id"],
            "created_at": company["created_at"],
        },
    }


@auth_router.post("/login")
def login(payload: LoginPayload):
    """Validate credentials and return user + company info."""
    user = authenticate_user(payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    company_id = user["company_id"]
    company = get_company(company_id)

    return {
        "success": True,
        "user": {
            "id": user["id"],
            "name": f"{user['first_name']} {user['last_name']}".strip(),
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"],
            "role": user["role"],
            "department": user.get("department", ""),
            "avatar": user.get("avatar", "U"),
            "is_owner": bool(user["is_owner"]),
            "company_id": company_id,
        },
        "company": {
            "id": company["id"],
            "name": company["name"],
            "trading_name": company.get("trading_name", ""),
            "industry": company["industry"],
            "company_size": company.get("company_size", ""),
            "website": company.get("website", ""),
            "city": company.get("city", ""),
            "state": company.get("state", ""),
            "country": company.get("country", "India"),
            "owner_name": company.get("owner_name", ""),
            "owner_designation": company.get("owner_designation", ""),
            "selected_modules": company["selected_modules"],
            "enabled_roles": company["enabled_roles"],
            "tenant_id": company["id"],
            "created_at": company["created_at"],
        },
    }


@auth_router.post("/add-user")
def add_user(payload: AddUserPayload):
    """Admin adds a new user to their company (no username field)."""
    # Validate company exists
    company = get_company(payload.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")

    if email_exists(payload.email):
        raise HTTPException(status_code=409, detail="A user with this email already exists")

    if len(payload.password) < 6:
        raise HTTPException(status_code=422, detail="Password must be at least 6 characters")

    user_id = create_user({
        "company_id": payload.company_id,
        "email": payload.email,
        "password": payload.password,
        "first_name": payload.first_name,
        "last_name": payload.last_name,
        "role": payload.role,
        "department": payload.department,
        "is_owner": False,
    })

    user = get_user_by_id(user_id)
    return {
        "success": True,
        "message": f"{payload.first_name} {payload.last_name} added successfully",
        "user": {
            "id": user["id"],
            "name": f"{user['first_name']} {user['last_name']}".strip(),
            "email": user["email"],
            "role": user["role"],
            "department": user.get("department", ""),
            "avatar": user.get("avatar", "U"),
            "is_owner": False,
            "company_id": payload.company_id,
        },
    }


@auth_router.get("/company/{company_id}/users")
def list_company_users(company_id: str):
    """Return all users belonging to a company."""
    company = get_company(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    users = get_company_users(company_id)
    return [
        {
            "id": u["id"],
            "name": f"{u['first_name']} {u['last_name']}".strip(),
            "email": u["email"],
            "role": u["role"],
            "department": u.get("department", ""),
            "avatar": u.get("avatar", "U"),
            "is_owner": bool(u["is_owner"]),
            "company_id": company_id,
        }
        for u in users
    ]


@auth_router.post("/permissions/role")
def save_role_permission(payload: RolePermissionPayload):
    """Save a role-level permission for a module (company-wide)."""
    company = get_company(payload.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    upsert_role_permission(
        payload.company_id, payload.role, payload.module,
        {"view": payload.view, "create": payload.create, "edit": payload.edit,
         "delete": payload.delete, "export": payload.export, "approve": payload.approve}
    )
    return {"success": True}


@auth_router.post("/permissions/role/bulk")
def save_bulk_role_permissions(payload: BulkRolePermissionsPayload):
    """Save multiple role permissions at once."""
    company = get_company(payload.company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    for p in payload.permissions:
        upsert_role_permission(
            payload.company_id, p.role, p.module,
            {"view": p.view, "create": p.create, "edit": p.edit,
             "delete": p.delete, "export": p.export, "approve": p.approve}
        )
    return {"success": True, "saved": len(payload.permissions)}


@auth_router.post("/permissions/user")
def save_user_permission(payload: UserPermissionPayload):
    """Save a user-level permission override."""
    upsert_user_permission(
        payload.company_id, payload.user_id, payload.module,
        {"view": payload.view, "create": payload.create, "edit": payload.edit,
         "delete": payload.delete, "export": payload.export, "approve": payload.approve}
    )
    return {"success": True}


@auth_router.get("/permissions/{company_id}")
def get_permissions(company_id: str):
    """Fetch all saved permissions for a company."""
    company = get_company(company_id)
    if not company:
        raise HTTPException(status_code=404, detail="Company not found")
    rows = get_all_permissions_for_company(company_id)
    return rows


@auth_router.put("/users/{user_id}")
def edit_user(user_id: str, payload: UpdateUserPayload):
    """Update a user's details (email, names, role, department, optional password)."""
    try:
        updated = update_user(user_id, {
            "first_name": payload.first_name,
            "last_name": payload.last_name,
            "email": payload.email,
            "role": payload.role,
            "department": payload.department,
            "password": payload.password,
        })
        return {
            "success": True,
            "message": "User updated successfully",
            "user": {
                "id": updated["id"],
                "name": f"{updated['first_name']} {updated['last_name']}".strip(),
                "email": updated["email"],
                "role": updated["role"],
                "department": updated.get("department", ""),
                "avatar": updated.get("avatar", "U"),
                "is_owner": bool(updated.get("is_owner")),
                "company_id": updated["company_id"],
            }
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@auth_router.delete("/users/{user_id}")
def remove_user(user_id: str, company_id: str):
    """Delete a user from the company."""
    try:
        delete_user(user_id, company_id)
        return {"success": True, "message": "User deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@auth_router.post("/permissions/user/bulk")
def save_bulk_user_permissions(payload: BulkUserPermissionsPayload):
    """Save multiple user permission overrides at once."""
    for p in payload.overrides:
        upsert_user_permission(
            payload.company_id, p.user_id, p.module,
            {"view": p.view, "create": p.create, "edit": p.edit,
             "delete": p.delete, "export": p.export, "approve": p.approve}
        )
    return {"success": True, "saved": len(payload.overrides)}


# ─── Customer Endpoints ───────────────────────────────────────────────────────

class CustomerPayload(BaseModel):
    id: Optional[str] = None
    businessName: Optional[str] = None
    business_name: Optional[str] = None
    customerType: Optional[str] = "Retailer"
    customer_type: Optional[str] = None
    contactPerson: Optional[str] = ""
    contact_person: Optional[str] = None
    email: str
    phone: Optional[str] = ""
    location: Optional[str] = ""
    industry: Optional[str] = ""
    accountOwner: Optional[str] = ""
    account_owner: Optional[str] = None
    status: Optional[str] = "Active"
    totalOrders: Optional[int] = 0
    total_orders: Optional[int] = None
    totalRevenue: Optional[float] = 0.0
    total_revenue: Optional[float] = None
    avgOrderValue: Optional[float] = 0.0
    avg_order_value: Optional[float] = None
    outstanding: Optional[float] = 0.0
    lastPurchase: Optional[str] = None
    customerSince: Optional[str] = None
    taxId: Optional[str] = ""
    tax_id: Optional[str] = None
    website: Optional[str] = ""
    address: Optional[str] = ""
    notes: Optional[str] = ""


class BulkCustomersPayload(BaseModel):
    customers: List[Dict[str, Any]]


@auth_router.get("/company/{company_id}/customers")
def list_company_customers(company_id: str):
    """Retrieve all customers registered for this company."""
    return get_company_customers(company_id)


@auth_router.post("/company/{company_id}/customers")
def add_company_customer(company_id: str, payload: CustomerPayload):
    """Add a single customer for this company."""
    try:
        cust = create_customer(company_id, payload.model_dump())
        return {"success": True, "customer": cust}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@auth_router.post("/company/{company_id}/customers/bulk")
def add_company_customers_bulk(company_id: str, payload: BulkCustomersPayload):
    """Bulk add multiple customers from Excel import."""
    try:
        created = bulk_create_customers(company_id, payload.customers)
        return {"success": True, "customers": created, "count": len(created)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@auth_router.put("/company/{company_id}/customers/{customer_id}")
def edit_company_customer(company_id: str, customer_id: str, payload: CustomerPayload):
    """Update a customer's details."""
    try:
        updated = update_customer(company_id, customer_id, payload.model_dump())
        return {"success": True, "customer": updated}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@auth_router.delete("/company/{company_id}/customers/{customer_id}")
def remove_company_customer(company_id: str, customer_id: str):
    """Delete a customer record."""
    try:
        delete_customer(company_id, customer_id)
        return {"success": True, "message": "Customer deleted successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


