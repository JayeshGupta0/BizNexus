"""
BizNexus SQLite Database Layer — Multi-Tenant Auth & RBAC
Tables:
  companies  — one row per registered business (tenant)
  users      — every registered/added user per company
  role_permissions — per-company role→module→permission overrides
"""

import sqlite3
import hashlib
import hmac
import os
import json
from datetime import datetime
from pathlib import Path

DB_PATH = Path(__file__).parent.parent.parent / "biznexus.db"


def _hash_password(password: str) -> str:
    """SHA-256 with a fixed salt. Replace with bcrypt in production."""
    return hashlib.sha256(f"biznexus_salt_{password}".encode()).hexdigest()


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


def init_db():
    """Create tables if they don't exist."""
    with get_connection() as conn:
        conn.executescript("""
        CREATE TABLE IF NOT EXISTS companies (
            id          TEXT PRIMARY KEY,
            name        TEXT NOT NULL,
            trading_name TEXT,
            industry    TEXT NOT NULL,
            company_size TEXT,
            website     TEXT,
            address     TEXT,
            city        TEXT,
            state       TEXT,
            country     TEXT DEFAULT 'India',
            pincode     TEXT,
            owner_name  TEXT NOT NULL,
            owner_designation TEXT,
            owner_phone TEXT,
            selected_modules TEXT NOT NULL,   -- JSON array
            enabled_roles    TEXT NOT NULL,   -- JSON array
            created_at  TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS users (
            id          TEXT PRIMARY KEY,
            company_id  TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
            email       TEXT NOT NULL,
            password_hash TEXT NOT NULL,
            first_name  TEXT NOT NULL,
            last_name   TEXT NOT NULL,
            role        TEXT NOT NULL,
            department  TEXT,
            avatar      TEXT,
            is_owner    INTEGER NOT NULL DEFAULT 0,
            created_at  TEXT NOT NULL,
            UNIQUE(email)
        );

        CREATE TABLE IF NOT EXISTS role_permissions (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            company_id  TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
            user_id     TEXT,                 -- NULL = role-level, NOT NULL = user override
            role        TEXT,                 -- NULL if user_id is set
            module      TEXT NOT NULL,
            perm_view   INTEGER DEFAULT 0,
            perm_create INTEGER DEFAULT 0,
            perm_edit   INTEGER DEFAULT 0,
            perm_delete INTEGER DEFAULT 0,
            perm_export INTEGER DEFAULT 0,
            perm_approve INTEGER DEFAULT 0,
            UNIQUE(company_id, user_id, role, module)
        );

        CREATE TABLE IF NOT EXISTS customers (
            id              TEXT PRIMARY KEY,
            company_id      TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
            business_name   TEXT NOT NULL,
            customer_type   TEXT DEFAULT 'Retailer',
            contact_person  TEXT,
            email           TEXT NOT NULL,
            phone           TEXT,
            location        TEXT,
            industry        TEXT,
            account_owner   TEXT,
            status          TEXT DEFAULT 'Active',
            total_orders    INTEGER DEFAULT 0,
            total_revenue   REAL DEFAULT 0,
            avg_order_value REAL DEFAULT 0,
            outstanding     REAL DEFAULT 0,
            last_purchase   TEXT,
            customer_since  TEXT,
            tax_id          TEXT,
            website         TEXT,
            address         TEXT,
            notes           TEXT,
            created_at      TEXT NOT NULL
        );
        """)



# ── Company ──────────────────────────────────────────────────────────────────

def create_company(data: dict) -> str:
    """Insert a new company record and return its id."""
    import uuid
    company_id = f"co-{uuid.uuid4().hex[:12]}"
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO companies
              (id, name, trading_name, industry, company_size, website,
               address, city, state, country, pincode,
               owner_name, owner_designation, owner_phone,
               selected_modules, enabled_roles, created_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        """, (
            company_id,
            data["company_name"],
            data.get("trading_name", ""),
            data["industry"],
            data.get("company_size", ""),
            data.get("website", ""),
            data.get("address", ""),
            data.get("city", ""),
            data.get("state", ""),
            data.get("country", "India"),
            data.get("pincode", ""),
            data["owner_name"],
            data.get("owner_designation", "Managing Director"),
            data.get("owner_phone", ""),
            json.dumps(data.get("selected_modules", [])),
            json.dumps(data.get("enabled_roles", ["Business Owner"])),
            datetime.utcnow().isoformat(),
        ))
    return company_id


def get_company(company_id: str) -> dict | None:
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM companies WHERE id=?", (company_id,)).fetchone()
    if not row:
        return None
    d = dict(row)
    d["selected_modules"] = json.loads(d["selected_modules"])
    d["enabled_roles"] = json.loads(d["enabled_roles"])
    return d


# ── Users ─────────────────────────────────────────────────────────────────────

def email_exists(email: str) -> bool:
    with get_connection() as conn:
        row = conn.execute("SELECT id FROM users WHERE email=?", (email.lower(),)).fetchone()
    return row is not None


def create_user(data: dict) -> str:
    """Insert a user record. Raises ValueError on duplicate email."""
    import uuid
    if email_exists(data["email"]):
        raise ValueError(f"Email {data['email']} is already registered")
    user_id = f"u-{uuid.uuid4().hex[:12]}"
    first = data.get("first_name", "")
    last = data.get("last_name", "")
    avatar = (first[:1] + last[:1]).upper() or "U"
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO users
              (id, company_id, email, password_hash, first_name, last_name,
               role, department, avatar, is_owner, created_at)
            VALUES (?,?,?,?,?,?,?,?,?,?,?)
        """, (
            user_id,
            data["company_id"],
            data["email"].lower(),
            _hash_password(data["password"]),
            first,
            last,
            data["role"],
            data.get("department", ""),
            avatar,
            1 if data.get("is_owner") else 0,
            datetime.utcnow().isoformat(),
        ))
    return user_id


def authenticate_user(email: str, password: str) -> dict | None:
    """
    Return user+company dict if credentials match, else None.
    """
    ph = _hash_password(password)
    with get_connection() as conn:
        row = conn.execute("""
            SELECT u.*, c.name as company_name, c.industry, c.selected_modules,
                   c.enabled_roles, c.trading_name, c.owner_name
            FROM users u
            JOIN companies c ON c.id = u.company_id
            WHERE u.email=? AND u.password_hash=?
        """, (email.lower(), ph)).fetchone()
    if not row:
        return None
    d = dict(row)
    d["selected_modules"] = json.loads(d["selected_modules"])
    d["enabled_roles"] = json.loads(d["enabled_roles"])
    return d


def get_company_users(company_id: str) -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute(
            "SELECT * FROM users WHERE company_id=? ORDER BY is_owner DESC, created_at",
            (company_id,)
        ).fetchall()
    return [dict(r) for r in rows]


def get_user_by_id(user_id: str) -> dict | None:
    with get_connection() as conn:
        row = conn.execute("SELECT * FROM users WHERE id=?", (user_id,)).fetchone()
    return dict(row) if row else None


def update_user(user_id: str, data: dict) -> dict:
    """Update user profile: email, names, role, department, avatar, and optional password."""
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")

    new_email = data.get("email", user["email"]).strip().lower()
    if new_email != user["email"].lower():
        if email_exists(new_email):
            raise ValueError(f"Email {new_email} is already in use by another account")

    first = data.get("first_name", user["first_name"]).strip()
    last = data.get("last_name", user["last_name"]).strip()
    avatar = (first[:1] + last[:1]).upper() or user.get("avatar", "U")
    role = data.get("role", user["role"])
    dept = data.get("department", user.get("department", ""))

    with get_connection() as conn:
        if data.get("password") and len(data["password"]) >= 6:
            ph = _hash_password(data["password"])
            conn.execute("""
                UPDATE users
                SET email=?, first_name=?, last_name=?, role=?, department=?, avatar=?, password_hash=?
                WHERE id=?
            """, (new_email, first, last, role, dept, avatar, ph, user_id))
        else:
            conn.execute("""
                UPDATE users
                SET email=?, first_name=?, last_name=?, role=?, department=?, avatar=?
                WHERE id=?
            """, (new_email, first, last, role, dept, avatar, user_id))

    return get_user_by_id(user_id)


def delete_user(user_id: str, company_id: str) -> bool:
    """Delete a user. Cannot delete company owner."""
    user = get_user_by_id(user_id)
    if not user:
        raise ValueError("User not found")
    if user.get("is_owner") == 1:
        raise ValueError("Cannot delete company administrator / business owner")
    if user.get("company_id") != company_id:
        raise ValueError("User does not belong to this company")

    with get_connection() as conn:
        conn.execute("DELETE FROM role_permissions WHERE user_id=? AND company_id=?", (user_id, company_id))
        conn.execute("DELETE FROM users WHERE id=? AND company_id=?", (user_id, company_id))
    return True



# ── Role Permissions ──────────────────────────────────────────────────────────

def upsert_role_permission(company_id: str, role: str, module: str, perms: dict):
    """Save or update a role-level permission for a module (company-wide)."""
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO role_permissions
              (company_id, role, module,
               perm_view, perm_create, perm_edit, perm_delete, perm_export, perm_approve)
            VALUES (?,?,?,?,?,?,?,?,?)
            ON CONFLICT(company_id, user_id, role, module)
            DO UPDATE SET
              perm_view=excluded.perm_view,
              perm_create=excluded.perm_create,
              perm_edit=excluded.perm_edit,
              perm_delete=excluded.perm_delete,
              perm_export=excluded.perm_export,
              perm_approve=excluded.perm_approve
        """, (
            company_id, role, module,
            int(perms.get("view", 0)),
            int(perms.get("create", 0)),
            int(perms.get("edit", 0)),
            int(perms.get("delete", 0)),
            int(perms.get("export", 0)),
            int(perms.get("approve", 0)),
        ))


def upsert_user_permission(company_id: str, user_id: str, module: str, perms: dict):
    """Save or update a user-level permission override."""
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO role_permissions
              (company_id, user_id, module,
               perm_view, perm_create, perm_edit, perm_delete, perm_export, perm_approve)
            VALUES (?,?,?,?,?,?,?,?,?)
            ON CONFLICT(company_id, user_id, role, module)
            DO UPDATE SET
              perm_view=excluded.perm_view,
              perm_create=excluded.perm_create,
              perm_edit=excluded.perm_edit,
              perm_delete=excluded.perm_delete,
              perm_export=excluded.perm_export,
              perm_approve=excluded.perm_approve
        """, (
            company_id, user_id, module,
            int(perms.get("view", 0)),
            int(perms.get("create", 0)),
            int(perms.get("edit", 0)),
            int(perms.get("delete", 0)),
            int(perms.get("export", 0)),
            int(perms.get("approve", 0)),
        ))


def get_role_permissions(company_id: str, role: str) -> list[dict]:
    """Return saved role-level permissions for this company+role."""
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT * FROM role_permissions
            WHERE company_id=? AND role=? AND user_id IS NULL
        """, (company_id, role)).fetchall()
    return [dict(r) for r in rows]


def get_user_permissions(company_id: str, user_id: str) -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT * FROM role_permissions
            WHERE company_id=? AND user_id=?
        """, (company_id, user_id)).fetchall()
    return [dict(r) for r in rows]


def get_all_permissions_for_company(company_id: str) -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT * FROM role_permissions WHERE company_id=?
        """, (company_id,)).fetchall()
    return [dict(r) for r in rows]


# ── Customers ─────────────────────────────────────────────────────────────────

def _row_to_customer(row: sqlite3.Row) -> dict:
    return {
        "id": row["id"],
        "companyId": row["company_id"],
        "businessName": row["business_name"],
        "customerType": row["customer_type"] or "Retailer",
        "contactPerson": row["contact_person"] or "",
        "email": row["email"],
        "phone": row["phone"] or "",
        "location": row["location"] or "",
        "industry": row["industry"] or "",
        "accountOwner": row["account_owner"] or "",
        "status": row["status"] or "Active",
        "totalOrders": int(row["total_orders"] or 0),
        "totalRevenue": float(row["total_revenue"] or 0.0),
        "avgOrderValue": float(row["avg_order_value"] or 0.0),
        "outstanding": float(row["outstanding"] or 0.0),
        "lastPurchase": row["last_purchase"] or "",
        "customerSince": row["customer_since"] or "",
        "taxId": row["tax_id"] or "",
        "website": row["website"] or "",
        "address": row["address"] or "",
        "notes": row["notes"] or "",
        "createdAt": row["created_at"],
    }


def create_customer(company_id: str, data: dict) -> dict:
    import uuid
    cust_id = data.get("id") or f"cust-{uuid.uuid4().hex[:8]}"
    today = datetime.utcnow().strftime("%Y-%m-%d")
    now_iso = datetime.utcnow().isoformat()

    with get_connection() as conn:
        conn.execute("""
            INSERT INTO customers (
                id, company_id, business_name, customer_type, contact_person,
                email, phone, location, industry, account_owner,
                status, total_orders, total_revenue, avg_order_value, outstanding,
                last_purchase, customer_since, tax_id, website, address,
                notes, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            cust_id,
            company_id,
            data.get("businessName") or data.get("business_name") or "New Customer",
            data.get("customerType") or data.get("customer_type") or "Retailer",
            data.get("contactPerson") or data.get("contact_person") or "",
            data.get("email") or "",
            data.get("phone") or "",
            data.get("location") or "",
            data.get("industry") or "",
            data.get("accountOwner") or data.get("account_owner") or "",
            data.get("status") or "Active",
            int(data.get("totalOrders") or data.get("total_orders") or 0),
            float(data.get("totalRevenue") or data.get("total_revenue") or 0.0),
            float(data.get("avgOrderValue") or data.get("avg_order_value") or 0.0),
            float(data.get("outstanding") or 0.0),
            data.get("lastPurchase") or data.get("last_purchase") or today,
            data.get("customerSince") or data.get("customer_since") or today,
            data.get("taxId") or data.get("tax_id") or "",
            data.get("website") or "",
            data.get("address") or "",
            data.get("notes") or "",
            now_iso,
        ))
        row = conn.execute("SELECT * FROM customers WHERE id=? AND company_id=?", (cust_id, company_id)).fetchone()
    return _row_to_customer(row)


def bulk_create_customers(company_id: str, items: list[dict]) -> list[dict]:
    import uuid
    today = datetime.utcnow().strftime("%Y-%m-%d")
    now_iso = datetime.utcnow().isoformat()
    created_ids = []

    with get_connection() as conn:
        for data in items:
            cust_id = data.get("id") or f"cust-{uuid.uuid4().hex[:8]}"
            created_ids.append(cust_id)
            conn.execute("""
                INSERT INTO customers (
                    id, company_id, business_name, customer_type, contact_person,
                    email, phone, location, industry, account_owner,
                    status, total_orders, total_revenue, avg_order_value, outstanding,
                    last_purchase, customer_since, tax_id, website, address,
                    notes, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                cust_id,
                company_id,
                data.get("businessName") or data.get("business_name") or "New Customer",
                data.get("customerType") or data.get("customer_type") or "Retailer",
                data.get("contactPerson") or data.get("contact_person") or "",
                data.get("email") or "",
                data.get("phone") or "",
                data.get("location") or "",
                data.get("industry") or "",
                data.get("accountOwner") or data.get("account_owner") or "",
                data.get("status") or "Active",
                int(data.get("totalOrders") or data.get("total_orders") or 0),
                float(data.get("totalRevenue") or data.get("total_revenue") or 0.0),
                float(data.get("avgOrderValue") or data.get("avg_order_value") or 0.0),
                float(data.get("outstanding") or 0.0),
                data.get("lastPurchase") or data.get("last_purchase") or today,
                data.get("customerSince") or data.get("customer_since") or today,
                data.get("taxId") or data.get("tax_id") or "",
                data.get("website") or "",
                data.get("address") or "",
                data.get("notes") or "",
                now_iso,
            ))
        rows = conn.execute(
            f"SELECT * FROM customers WHERE company_id=? AND id IN ({','.join(['?']*len(created_ids))}) ORDER BY created_at DESC",
            [company_id] + created_ids
        ).fetchall()
    return [_row_to_customer(r) for r in rows]


def get_company_customers(company_id: str) -> list[dict]:
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT * FROM customers WHERE company_id=? ORDER BY created_at DESC
        """, (company_id,)).fetchall()
    return [_row_to_customer(r) for r in rows]


def update_customer(company_id: str, customer_id: str, data: dict) -> dict:
    with get_connection() as conn:
        existing = conn.execute("SELECT * FROM customers WHERE id=? AND company_id=?", (customer_id, company_id)).fetchone()
        if not existing:
            raise ValueError("Customer not found")

        conn.execute("""
            UPDATE customers SET
                business_name   = ?,
                customer_type   = ?,
                contact_person  = ?,
                email           = ?,
                phone           = ?,
                location        = ?,
                industry        = ?,
                account_owner   = ?,
                status          = ?,
                total_orders    = ?,
                total_revenue   = ?,
                avg_order_value = ?,
                outstanding     = ?,
                last_purchase   = ?,
                customer_since  = ?,
                tax_id          = ?,
                website         = ?,
                address         = ?,
                notes           = ?
            WHERE id = ? AND company_id = ?
        """, (
            data.get("businessName") or data.get("business_name") or existing["business_name"],
            data.get("customerType") or data.get("customer_type") or existing["customer_type"],
            data.get("contactPerson") if "contactPerson" in data or "contact_person" in data else existing["contact_person"],
            data.get("email") or existing["email"],
            data.get("phone") if "phone" in data else existing["phone"],
            data.get("location") if "location" in data else existing["location"],
            data.get("industry") if "industry" in data else existing["industry"],
            data.get("accountOwner") if "accountOwner" in data or "account_owner" in data else existing["account_owner"],
            data.get("status") or existing["status"],
            int(data.get("totalOrders") if "totalOrders" in data else (data.get("total_orders") if "total_orders" in data else existing["total_orders"])),
            float(data.get("totalRevenue") if "totalRevenue" in data else (data.get("total_revenue") if "total_revenue" in data else existing["total_revenue"])),
            float(data.get("avgOrderValue") if "avgOrderValue" in data else (data.get("avg_order_value") if "avg_order_value" in data else existing["avg_order_value"])),
            float(data.get("outstanding") if "outstanding" in data else existing["outstanding"]),
            data.get("lastPurchase") or data.get("last_purchase") or existing["last_purchase"],
            data.get("customerSince") or data.get("customer_since") or existing["customer_since"],
            data.get("taxId") if "taxId" in data or "tax_id" in data else existing["tax_id"],
            data.get("website") if "website" in data else existing["website"],
            data.get("address") if "address" in data else existing["address"],
            data.get("notes") if "notes" in data else existing["notes"],
            customer_id,
            company_id,
        ))
        updated = conn.execute("SELECT * FROM customers WHERE id=? AND company_id=?", (customer_id, company_id)).fetchone()
    return _row_to_customer(updated)


def delete_customer(company_id: str, customer_id: str) -> bool:
    with get_connection() as conn:
        res = conn.execute("DELETE FROM customers WHERE id=? AND company_id=?", (customer_id, company_id))
        if res.rowcount == 0:
            raise ValueError("Customer not found")
    return True


# Initialise on import
init_db()

