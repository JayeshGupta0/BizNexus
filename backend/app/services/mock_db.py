"""
In-Memory Realistic Enterprise Data Store for BizNexus Prototype
"""

MOCK_KPIS = [
    {"title": "Revenue", "value": "₹42.8L", "change": "+18.4% vs last month", "change_type": "positive", "accent": "#2563eb"},
    {"title": "Sales", "value": "₹18.6L", "change": "+12.1% vs last month", "change_type": "positive", "accent": "#16a34a"},
    {"title": "Active Leads", "value": "1,248", "change": "+84 new this week", "change_type": "positive", "accent": "#7c3aed"},
    {"title": "Customers", "value": "486", "change": "+28 new accounts", "change_type": "positive", "accent": "#0ea5e9"},
    {"title": "Outstanding", "value": "₹6.4L", "change": "5 invoices overdue", "change_type": "negative", "accent": "#f59e0b"},
    {"title": "Inventory Value", "value": "₹28.2L", "change": "3 low-stock items", "change_type": "neutral", "accent": "#64748b"}
]

MOCK_REVENUE_TREND = [
    {"month": "Apr", "revenue": 24.2, "expenses": 14.8},
    {"month": "May", "revenue": 28.6, "expenses": 16.2},
    {"month": "Jun", "revenue": 31.4, "expenses": 17.5},
    {"month": "Jul", "revenue": 34.8, "expenses": 19.1},
    {"month": "Aug", "revenue": 38.2, "expenses": 20.4},
    {"month": "Sep", "revenue": 42.8, "expenses": 22.1}
]

MOCK_LEADS = [
    {
        "id": "lead-001",
        "name": "Nova Distributor Partnership",
        "company": "Nova Distributor Pvt Ltd",
        "lead_type": "Distributor",
        "stage": "NEGOTIATION",
        "potential_value": 1250000.0,
        "potential_value_formatted": "₹12.5L",
        "source": "LinkedIn",
        "priority": "High",
        "assigned_to": "Rahul Sharma",
        "contact_person": "Vikrant Verma",
        "email": "vikrant@novadist.in",
        "phone": "+91 98201 44521",
        "location": "Ahmedabad, Gujarat",
        "industry": "Consumer Electronics",
        "probability": 75,
        "expected_close": "15 Sep 2026",
        "last_activity": "Pricing revised after negotiation call",
        "next_follow_up": "Final commercial sign-off call",
        "ai_insight": "High-value distributor opportunity. Engagement is accelerating with multiple pricing reviews. 75% win probability."
    },
    {
        "id": "lead-002",
        "name": "Acme Retail Store Expansion",
        "company": "Acme Retail Chain",
        "lead_type": "Retailer",
        "stage": "PROPOSAL",
        "potential_value": 480000.0,
        "potential_value_formatted": "₹4.8L",
        "source": "Website",
        "priority": "Medium",
        "assigned_to": "Rahul Sharma",
        "contact_person": "Pooja Hegde",
        "email": "pooja@acmeretail.com",
        "phone": "+91 98112 33412",
        "location": "Mumbai, Maharashtra",
        "industry": "Retail & Supermarkets",
        "probability": 65,
        "expected_close": "22 Sep 2026",
        "last_activity": "Quotation BNX-Q-092 sent",
        "next_follow_up": "Follow-up on quotation feedback",
        "ai_insight": "Lead converted from direct website inbound. Good credit profile and high repeat potential."
    },
    {
        "id": "lead-003",
        "name": "ABC Wholesale Network",
        "company": "ABC Wholesale Traders",
        "lead_type": "Wholesaler",
        "stage": "QUALIFIED",
        "potential_value": 720000.0,
        "potential_value_formatted": "₹7.2L",
        "source": "Instagram",
        "priority": "High",
        "assigned_to": "Rahul Sharma",
        "contact_person": "Sunil Nair",
        "email": "sunil@abcwholesale.com",
        "phone": "+91 97401 22891",
        "location": "Bengaluru, Karnataka",
        "industry": "Fast Moving Consumer Goods",
        "probability": 50,
        "expected_close": "30 Sep 2026",
        "last_activity": "Product demo presentation delivered",
        "next_follow_up": "Send sample agreement and pricing tiers",
        "ai_insight": "Generated via Wholesale Partner Instagram ad campaign. Highly engaged with marketing collateral."
    }
]

MOCK_CUSTOMERS = [
    {
        "id": "cust-001",
        "name": "Acme Corporation",
        "type": "Enterprise",
        "contact_person": "Rajesh Sharma",
        "email": "rajesh.sharma@acmecorp.in",
        "phone": "+91 98200 11223",
        "location": "Mumbai, Maharashtra",
        "orders_count": 126,
        "total_revenue": 1840000.0,
        "total_revenue_formatted": "₹18.4L",
        "outstanding": 120000.0,
        "outstanding_formatted": "₹1.2L",
        "status": "Active",
        "account_owner": "Arjun Mehta",
        "customer_since": "Jan 2024",
        "health_score": 94,
        "ai_insight": "Top revenue enterprise partner. Reorder frequency is 14% higher than average. Low churn risk."
    },
    {
        "id": "cust-002",
        "name": "Nova Retail",
        "type": "Retailer",
        "contact_person": "Priya Shah",
        "email": "priya@novaretail.com",
        "phone": "+91 98330 44556",
        "location": "Pune, Maharashtra",
        "orders_count": 84,
        "total_revenue": 860000.0,
        "total_revenue_formatted": "₹8.6L",
        "outstanding": 42000.0,
        "outstanding_formatted": "₹42K",
        "status": "Active",
        "account_owner": "Rahul Sharma",
        "customer_since": "Mar 2024",
        "health_score": 88,
        "ai_insight": "Solid payment history with steady weekly replenishment cycles. Recommended candidate for volume discount."
    }
]

MOCK_PRODUCTS = [
    {"id": "prod-001", "sku": "BNX-CRM-001", "name": "Enterprise CRM Suite", "category": "Software", "price": 48000.0, "cost": 12000.0, "stock": 84, "reorder_level": 20, "status": "In Stock", "supplier": "TechSource India"},
    {"id": "prod-002", "sku": "BNX-ANA-002", "name": "Business Analytics Pro", "category": "Software", "price": 36000.0, "cost": 8000.0, "stock": 8, "reorder_level": 15, "status": "Low Stock", "supplier": "TechSource India"},
    {"id": "prod-003", "sku": "BNX-INV-003", "name": "Inventory Management Module", "category": "Software", "price": 24000.0, "cost": 6000.0, "stock": 0, "reorder_level": 10, "status": "Out of Stock", "supplier": "Global Components"},
    {"id": "prod-004", "sku": "BNX-AI-004", "name": "AI Assistant Pro", "category": "AI Modules", "price": 60000.0, "cost": 15000.0, "stock": 45, "reorder_level": 10, "status": "In Stock", "supplier": "TechSource India"},
    {"id": "prod-005", "sku": "BNX-ERP-005", "name": "Cloud ERP Package", "category": "Enterprise ERP", "price": 84000.0, "cost": 22000.0, "stock": 29, "reorder_level": 8, "status": "In Stock", "supplier": "Prime Distribution"}
]

MOCK_ORDERS = [
    {"id": "ORD-1048", "customer_name": "Acme Corporation", "amount": 240000.0, "amount_formatted": "₹2.4L", "date": "02 Sep 2026", "payment_status": "Paid", "fulfillment_status": "Delivered", "items_count": 5},
    {"id": "ORD-1047", "customer_name": "Nova Retail", "amount": 180000.0, "amount_formatted": "₹1.8L", "date": "01 Sep 2026", "payment_status": "Paid", "fulfillment_status": "Delivered", "items_count": 3},
    {"id": "ORD-1046", "customer_name": "Vertex Solutions", "amount": 320000.0, "amount_formatted": "₹3.2L", "date": "29 Aug 2026", "payment_status": "Pending", "fulfillment_status": "Processing", "items_count": 8}
]

MOCK_INVOICES = [
    {"id": "INV-2048", "customer_name": "Acme Corporation", "amount": 240000.0, "amount_formatted": "₹2.4L", "issue_date": "02 Sep 2026", "due_date": "02 Oct 2026", "status": "Paid"},
    {"id": "INV-2047", "customer_name": "Vertex Solutions", "amount": 267000.0, "amount_formatted": "₹2.67L", "issue_date": "15 Aug 2026", "due_date": "15 Sep 2026", "status": "Overdue"},
    {"id": "INV-2046", "customer_name": "Nova Retail", "amount": 180000.0, "amount_formatted": "₹1.8L", "issue_date": "01 Sep 2026", "due_date": "01 Oct 2026", "status": "Paid"}
]

MOCK_SOCIAL_POSTS = [
    {
        "id": "post-001",
        "platform": "LinkedIn",
        "title": "Wholesale Partner Program",
        "content": "Scale your retail distribution network with automated multi-tier pricing and intelligent inventory management.",
        "reach": 84200,
        "likes": 6420,
        "clicks": 1280,
        "leads_generated": 126,
        "qualified_leads": 48,
        "conversions": 12,
        "revenue_attributed": 840000.0,
        "status": "Published"
    }
]

MOCK_DOCUMENTS = [
    {"id": "doc-001", "name": "Q2 Sales Report 2025.pdf", "category": "Report", "size": "3.8 MB", "uploaded_by": "Arjun Mehta", "uploaded_date": "05 Jul 2025", "status": "Indexed", "rag_indexed": True},
    {"id": "doc-002", "name": "Enterprise Service Agreement Template.docx", "category": "Contract", "size": "1.2 MB", "uploaded_by": "Neha Patel", "uploaded_date": "12 Aug 2025", "status": "Indexed", "rag_indexed": True},
    {"id": "doc-003", "name": "Supply Chain Master Policy 2025.pdf", "category": "Business Document", "size": "4.5 MB", "uploaded_by": "Vikram Rao", "uploaded_date": "19 Aug 2025", "status": "Indexed", "rag_indexed": True}
]

MOCK_USERS = [
    {"id": "user-1", "name": "Arjun Mehta", "email": "arjun@biznexus.in", "role": "Business Owner", "department": "Executive", "access_scope": "All Access", "status": "Active", "avatar": "AM"},
    {"id": "user-2", "name": "Priya Shah", "email": "priya.shah@biznexus.in", "role": "Marketing Manager", "department": "Marketing", "access_scope": "Marketing + Leads", "status": "Active", "avatar": "PS"},
    {"id": "user-3", "name": "Rahul Sharma", "email": "rahul.s@biznexus.in", "role": "Sales Executive", "department": "Sales", "access_scope": "Assigned CRM", "status": "Active", "avatar": "RS"},
    {"id": "user-4", "name": "Neha Patel", "email": "neha.p@biznexus.in", "role": "Finance Manager", "department": "Finance", "access_scope": "Finance", "status": "Active", "avatar": "NP"},
    {"id": "user-5", "name": "Vikram Rao", "email": "vikram.r@biznexus.in", "role": "Inventory Manager", "department": "Operations", "access_scope": "Inventory", "status": "Active", "avatar": "VR"},
    {"id": "user-6", "name": "Aisha Khan", "email": "aisha.k@biznexus.in", "role": "Business Analyst", "department": "Strategy", "access_scope": "Analytics", "status": "Active", "avatar": "AK"}
]

MOCK_USER_OVERRIDES = [
    {"user_id": "user-3", "module": "customers", "permission": "export", "granted": True}
]
