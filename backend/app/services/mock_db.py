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
        "name": "Zepto Quick Grocery Hubs Tender",
        "company": "Zepto Commerce Pvt Ltd",
        "lead_type": "Retailer",
        "stage": "NEGOTIATION",
        "potential_value": 1480000.0,
        "potential_value_formatted": "₹14.8L",
        "source": "Website",
        "priority": "High",
        "assigned_to": "Rahul Sharma",
        "contact_person": "Vivek Kapoor",
        "email": "vivek.kapoor@zepto.in",
        "phone": "+91 98001 23456",
        "location": "Jaipur, Rajasthan",
        "industry": "Quick Commerce & Instant Grocery",
        "probability": 75,
        "expected_close": "30 Sep 2026",
        "last_activity": "Revised tier rebate on Maggi & Nescafé delivered",
        "next_follow_up": "Final commercial sign-off call",
        "ai_insight": "High-velocity quick commerce distributor. Weekly reorder frequency projected at 4x average modern trade accounts. 75% win probability."
    },
    {
        "id": "lead-002",
        "name": "Taj Hotels F&B Procurement",
        "company": "The Indian Hotels Company Ltd (Taj)",
        "lead_type": "Enterprise",
        "stage": "QUALIFIED",
        "potential_value": 2400000.0,
        "potential_value_formatted": "₹24.0L",
        "source": "Sales Team",
        "priority": "High",
        "assigned_to": "Rahul Sharma",
        "contact_person": "Mohan Lal",
        "email": "mohan.lal@tajhotels.com",
        "phone": "+91 97002 34567",
        "location": "Mumbai, Maharashtra",
        "industry": "Luxury Hospitality & Catering",
        "probability": 60,
        "expected_close": "15 Oct 2026",
        "last_activity": "Quotation QT-1084 with HoReCa bulk discounts delivered",
        "next_follow_up": "Follow-up on executive chef tasting feedback",
        "ai_insight": "Institutional HoReCa annual contract for Nescafé coffee beans, Nestea, and culinary Milkmaid."
    },
    {
        "id": "lead-003",
        "name": "Haldiram Festive Sweet Manufacturing",
        "company": "Haldiram Snacks & Sweets Chain",
        "lead_type": "Wholesaler",
        "stage": "NEGOTIATION",
        "potential_value": 1850000.0,
        "potential_value_formatted": "₹18.5L",
        "source": "LinkedIn",
        "priority": "High",
        "assigned_to": "Rahul Sharma",
        "contact_person": "Sanjay Aggarwal",
        "email": "sanjay@haldirams.com",
        "phone": "+91 96003 45678",
        "location": "Nagpur, Maharashtra",
        "industry": "Confectionery & QSR Retail",
        "probability": 80,
        "expected_close": "20 Sep 2026",
        "last_activity": "Bulk Milkmaid condensed milk quote accepted",
        "next_follow_up": "Dispatch schedule confirmation",
        "ai_insight": "Festive seasonal demand for bulk Nestlé Milkmaid trays. Factory quality and cold-chain compliance verified."
    }
]

MOCK_CUSTOMERS = [
    {
        "id": "cust-001",
        "name": "Reliance Retail Ventures Ltd",
        "type": "Enterprise",
        "contact_person": "Suresh Menon",
        "email": "suresh.menon@relianceretail.com",
        "phone": "+91 98765 43210",
        "location": "Mumbai, Maharashtra",
        "orders_count": 142,
        "total_revenue": 4840000.0,
        "total_revenue_formatted": "₹48.4L",
        "outstanding": 184000.0,
        "outstanding_formatted": "₹1.84L",
        "status": "Active",
        "account_owner": "Rahul Sharma",
        "customer_since": "Mar 2021",
        "health_score": 96,
        "ai_insight": "Top modern trade partner nationally. Steady weekly replenishment on Maggi 2-Minute Noodles and Nescafé Classic jars."
    },
    {
        "id": "cust-002",
        "name": "Avenue Supermarts Ltd (DMart)",
        "type": "Enterprise",
        "contact_person": "Anjali Desai",
        "email": "anjali.desai@dmartindia.com",
        "phone": "+91 99887 65432",
        "location": "Thane, Maharashtra",
        "orders_count": 128,
        "total_revenue": 5620000.0,
        "total_revenue_formatted": "₹56.2L",
        "outstanding": 96000.0,
        "outstanding_formatted": "₹96K",
        "status": "Active",
        "account_owner": "Rahul Sharma",
        "customer_since": "Nov 2020",
        "health_score": 98,
        "ai_insight": "Highest volume grocery supermarket chain. Excellent credit rating and zero payment dispute history."
    }
]

MOCK_PRODUCTS = [
    {"id": "prod-001", "sku": "NES-MAG-001", "name": "Maggi 2-Minute Masala Noodles (Master Carton - 96 packs)", "category": "Instant Foods", "price": 1440.0, "cost": 960.0, "stock": 1250, "reorder_level": 200, "status": "In Stock", "supplier": "Punjab Golden Wheat Agro Flour Mills"},
    {"id": "prod-002", "sku": "NES-COF-002", "name": "Nescafé Classic Instant Coffee (Glass Jar 200g - Case of 24)", "category": "Beverages & Coffee", "price": 13200.0, "cost": 8400.0, "stock": 480, "reorder_level": 80, "status": "In Stock", "supplier": "Karnataka Planters Green Coffee Estate"},
    {"id": "prod-003", "sku": "NES-KIT-003", "name": "KitKat 4-Finger Milk Chocolate Wafer (Box of 48 Bars)", "category": "Confectionery", "price": 1920.0, "cost": 1200.0, "stock": 850, "reorder_level": 150, "status": "In Stock", "supplier": "National Dairy Cooperatives & Milk Union"},
    {"id": "prod-004", "sku": "NES-MLK-004", "name": "Nestlé Milkmaid Sweetened Condensed Milk (Tin 400g - Tray of 24)", "category": "Dairy & Culinary", "price": 3840.0, "cost": 2600.0, "stock": 620, "reorder_level": 100, "status": "In Stock", "supplier": "National Dairy Cooperatives & Milk Union"},
    {"id": "prod-005", "sku": "NES-CER-005", "name": "Nestlé Cerelac Fortified Baby Cereal Wheat & Apple (Case of 18)", "category": "Nutrition & Baby Foods", "price": 5400.0, "cost": 3600.0, "stock": 310, "reorder_level": 50, "status": "In Stock", "supplier": "Punjab Golden Wheat Agro Flour Mills"},
    {"id": "prod-006", "sku": "NES-EVR-006", "name": "Nestlé Everyday Dairy Whitener (1kg Pouch - Box of 12)", "category": "Dairy & Milk Powders", "price": 5160.0, "cost": 3500.0, "stock": 540, "reorder_level": 90, "status": "In Stock", "supplier": "National Dairy Cooperatives & Milk Union"},
    {"id": "prod-007", "sku": "NES-TEA-007", "name": "Nestea Lemon Instant Iced Tea Mix (Pouch 1kg - Box of 10)", "category": "Beverages & Tea", "price": 3600.0, "cost": 2300.0, "stock": 420, "reorder_level": 70, "status": "In Stock", "supplier": "Karnataka Planters Green Coffee Estate"}
]

MOCK_QUOTATIONS = [
    {"id": "QT-1085", "client_name": "Reliance Retail Ventures Ltd", "type": "Customer", "total": 661248.0, "total_formatted": "₹6.61L", "created_date": "02 Sep 2026", "expiry_date": "02 Oct 2026", "salesperson": "Rahul Sharma", "status": "Draft", "notes": "Q4 Modern Trade master agreement for Reliance Retail stores."},
    {"id": "QT-1084", "client_name": "Avenue Supermarts Ltd (DMart)", "type": "Customer", "total": 638208.0, "total_formatted": "₹6.38L", "created_date": "28 Aug 2026", "expiry_date": "28 Sep 2026", "salesperson": "Priya Shah", "status": "Viewed", "notes": "Under commercial evaluation by DMart central FMCG purchasing team."},
    {"id": "QT-1083", "client_name": "Haldiram Snacks & Sweets Chain", "type": "Lead", "total": 2154240.0, "total_formatted": "₹21.5L", "created_date": "25 Aug 2026", "expiry_date": "25 Sep 2026", "salesperson": "Rahul Sharma", "status": "Sent", "notes": "Bulk festive order of Nestlé Milkmaid condensed milk for sweet making."},
    {"id": "QT-1082", "client_name": "Zepto Quick Grocery Hubs", "type": "Lead", "total": 783744.0, "total_formatted": "₹7.84L", "created_date": "10 Aug 2026", "expiry_date": "10 Sep 2026", "salesperson": "Priya Shah", "status": "Viewed", "notes": "Zepto Dark Store expansion quote for 18 regional micro-hubs."},
    {"id": "QT-1081", "client_name": "Metro Cash & Carry Wholesale", "type": "Customer", "total": 998016.0, "total_formatted": "₹9.98L", "created_date": "18 Aug 2026", "expiry_date": "18 Sep 2026", "salesperson": "Priya Shah", "status": "Accepted", "notes": "Approved by Metro Wholesale category manager. Ready for fulfillment."},
    {"id": "QT-1080", "client_name": "Blinkit Commerce Dark Stores", "type": "Customer", "total": 182400.0, "total_formatted": "₹1.82L", "created_date": "20 Aug 2026", "expiry_date": "20 Sep 2026", "salesperson": "Priya Shah", "status": "Accepted", "notes": "KitKat flash sale replenishment for Blinkit Gurgaon dark stores."}
]

MOCK_ORDERS = [
    {"id": "ORD-1048", "customer_name": "Reliance Retail Ventures Ltd", "amount": 486000.0, "amount_formatted": "₹4.86L", "date": "28 Aug 2026", "payment_status": "Paid", "fulfillment_status": "Delivered", "items_count": 215},
    {"id": "ORD-1049", "customer_name": "Avenue Supermarts Ltd (DMart)", "amount": 509760.0, "amount_formatted": "₹5.10L", "date": "01 Sep 2026", "payment_status": "Pending", "fulfillment_status": "Processing", "items_count": 210},
    {"id": "ORD-1050", "customer_name": "Metro Cash & Carry Wholesale", "amount": 679008.0, "amount_formatted": "₹6.79L", "date": "02 Sep 2026", "payment_status": "Paid", "fulfillment_status": "Confirmed", "items_count": 390}
]

MOCK_INVOICES = [
    {"id": "INV-2048", "customer_name": "Reliance Retail Ventures Ltd", "amount": 486000.0, "amount_formatted": "₹4.86L", "issue_date": "28 Aug 2026", "due_date": "27 Sep 2026", "status": "Paid"},
    {"id": "INV-2049", "customer_name": "Avenue Supermarts Ltd (DMart)", "amount": 509760.0, "amount_formatted": "₹5.10L", "issue_date": "01 Sep 2026", "due_date": "01 Oct 2026", "status": "Sent"},
    {"id": "INV-2050", "customer_name": "Metro Cash & Carry Wholesale", "amount": 679008.0, "amount_formatted": "₹6.79L", "issue_date": "02 Sep 2026", "due_date": "02 Oct 2026", "status": "Paid"}
]

MOCK_SOCIAL_POSTS = [
    {
        "id": "post-001",
        "platform": "Instagram",
        "title": "2-Minute Happiness: Fueling Monsoon Memories",
        "content": "Rains, friends, and steaming bowls of Maggi! Keep your store shelves stocked with the all-time favorite snack. Order master cartons directly on the Nestlé B2B portal. 🍜💛",
        "reach": 142800,
        "likes": 6842,
        "clicks": 8840,
        "leads_generated": 186,
        "qualified_leads": 88,
        "conversions": 28,
        "revenue_attributed": 1840000.0,
        "status": "Published"
    }
]

MOCK_DOCUMENTS = [
    {"id": "doc-001", "name": "FSSAI Central Food Safety Audit Report 2025.pdf", "category": "Report", "size": "3.4 MB", "uploaded_by": "Aisha Khan", "uploaded_date": "05 Jul 2025", "status": "Indexed", "rag_indexed": True},
    {"id": "doc-002", "name": "Reliance Retail Master Supply Agreement.pdf", "category": "Contract", "size": "2.8 MB", "uploaded_by": "Suresh Narayanan", "uploaded_date": "20 Mar 2025", "status": "Indexed", "rag_indexed": True},
    {"id": "doc-003", "name": "National Dairy Union Procurement Agreement.pdf", "category": "Business Document", "size": "3.1 MB", "uploaded_by": "Sanjay Kumar", "uploaded_date": "15 Jan 2025", "status": "Indexed", "rag_indexed": True}
]

MOCK_USERS = [
    {"id": "user-1", "name": "Suresh Narayanan", "email": "suresh@nestle.in", "role": "Business Owner", "department": "Executive", "access_scope": "All Access", "status": "Active", "avatar": "SN"},
    {"id": "user-2", "name": "Rahul Sharma", "email": "rahul.sharma@nestle.in", "role": "Sales Manager", "department": "Sales & Modern Trade", "access_scope": "Sales + Modern Trade", "status": "Active", "avatar": "RS"},
    {"id": "user-3", "name": "Priya Shah", "email": "priya.shah@nestle.in", "role": "Sales Executive", "department": "Key Accounts", "access_scope": "Assigned Accounts", "status": "Active", "avatar": "PS"},
    {"id": "user-4", "name": "Kavya Nair", "email": "kavya.nair@nestle.in", "role": "Marketing Manager", "department": "Brand Marketing", "access_scope": "Campaigns + Social", "status": "Active", "avatar": "KN"},
    {"id": "user-5", "name": "Vikram Rao", "email": "vikram.rao@nestle.in", "role": "Inventory Manager", "department": "Supply Chain", "access_scope": "Cold Chain & Warehousing", "status": "Active", "avatar": "VR"},
    {"id": "user-6", "name": "Sanjay Kumar", "email": "sanjay.kumar@nestle.in", "role": "Purchase Manager", "department": "Agro Procurement", "access_scope": "Procurement & Suppliers", "status": "Active", "avatar": "SK"},
    {"id": "user-7", "name": "Neha Patel", "email": "neha.patel@nestle.in", "role": "Finance Manager", "department": "Commercial Finance", "access_scope": "Financial Ledgers & Taxes", "status": "Active", "avatar": "NP"},
    {"id": "user-8", "name": "Aisha Khan", "email": "aisha.khan@nestle.in", "role": "Business Analyst", "department": "Demand Analytics", "access_scope": "Analytics & Forecasting", "status": "Active", "avatar": "AK"}
]

MOCK_USER_OVERRIDES = [
    {"user_id": "user-3", "module": "customers", "permission": "export", "granted": True}
]
