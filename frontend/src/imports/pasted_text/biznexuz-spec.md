# BIZNEXUZ — COMPLETE INTERACTIVE PROTOTYPE SPECIFICATION

Build a polished, responsive, production-style web application prototype called **BizNexuz**.

BizNexuz is an **AI-powered unified CRM + ERP + Marketing + Business Analytics platform** for businesses.

The application combines:

* CRM
* Lead Management
* Customer/Business Account Management
* Sales & Orders
* Products
* Inventory
* Purchasing
* Suppliers
* Finance
* Marketing & Social Content
* Business Analytics
* Documents
* AI Assistant using RAG
* Role-Based Access Control (RBAC)

The prototype should feel like a modern enterprise SaaS product similar in quality to professional CRM/ERP platforms, while having its own visual identity.

---

# 1. CORE PRODUCT CONCEPT

BizNexuz is designed from the **company/business perspective**.

IMPORTANT:

Do NOT treat every individual person who purchases something as a CRM Lead.

A Lead represents a potential business opportunity such as:

* Retailer requesting pricing
* Wholesaler requesting quotation
* Business submitting an enquiry
* Potential distributor
* Social media-generated prospect
* Referral prospect
* Event-generated prospect
* Website enquiry
* Campaign-generated prospect
* Other potential business opportunity

Customers represent established business accounts/entities that have an ongoing purchasing relationship with the company.

Examples:

* Retailer
* Wholesaler
* Distributor
* Business
* Enterprise account

The system should focus on **business accounts and opportunities**, not millions of individual consumer records.

---

# 2. VISUAL DESIGN SYSTEM

Create a clean modern enterprise SaaS interface.

Style:

* Professional
* Minimal
* Premium
* Data-rich but not cluttered
* Modern B2B SaaS
* Desktop-first but responsive
* Strong visual hierarchy
* Rounded cards
* Subtle borders
* Light neutral background
* White content cards
* Blue as primary brand color
* Green for positive/success
* Amber for warnings
* Red for errors/lost items
* Purple for AI/intelligence features

Use:

* Inter or similar modern sans-serif
* 8px spacing system
* 10–14px border radius
* Subtle shadows only where useful
* Consistent button styles
* Consistent badges
* Consistent table styles
* Consistent chart styles
* Consistent form controls

Brand:

**BizNexuz**

Tagline:

**Intelligent Business Platform**

Logo should be a simple modern "B" mark.

---

# 3. GLOBAL APPLICATION LAYOUT

Use a persistent desktop layout:

LEFT SIDEBAR
+
TOP NAVIGATION
+
MAIN CONTENT AREA

Sidebar:

BizNexuz logo

OVERVIEW

* Dashboard

CRM

* Leads & Pipeline
* Customers

SALES

* Sales Orders
* Quotations

INVENTORY

* Products
* Inventory

PROCUREMENT

* Purchases
* Suppliers

FINANCE

* Invoices
* Payments
* Expenses

MARKETING

* Social Content
* Campaigns

INTELLIGENCE

* Analytics
* Documents
* AI Assistant

SYSTEM

* Users & Roles
* Settings

Sidebar must be **RBAC-aware**.

Users should only see modules/pages they have permission to access.

Top navigation:

* Breadcrumb
* Global search
* Notifications
* User avatar
* User name / role
* Optional help icon

---

# 4. LOGIN PAGE

Create a polished login screen.

Elements:

BizNexuz logo

"Welcome back"

Email

Password

Remember me

Forgot password?

Sign In

Optional:

"Continue with Google"

After login, the prototype should simulate identifying the user's role.

Provide a prototype role switch/demo mechanism so different roles can be demonstrated.

---

# 5. ROLE SELECTION / DEMO MODE

For the prototype, include a discreet "Demo User" or role selector.

Available demo users:

1. Business Owner
2. Sales Manager
3. Sales Executive
4. Marketing Manager
5. Inventory Manager
6. Purchase Manager
7. Finance Manager
8. Business Analyst

Changing the demo user should change:

* Sidebar visibility
* Dashboard content
* Available pages
* Available actions
* Data visibility
* Permission indicators

This demonstrates RBAC.

---

# 6. BUSINESS OWNER DASHBOARD

Create a comprehensive executive dashboard.

Header:

"Good morning, Arjun"

"Here's what's happening across your business."

KPI cards:

* Revenue
* Sales
* Active Leads
* Customers
* Outstanding Payments
* Inventory Value

Charts:

1. Revenue Trend
2. Sales Performance
3. Lead Generation Trend
4. Lead Conversion Funnel
5. Revenue by Product Category
6. Sales by Region

Additional cards:

* Top Customers
* Top Products
* Recent Orders
* Low Stock Alerts
* Outstanding Payments
* Recent Leads

AI insight card:

"AI Business Insight"

Example:

"Revenue increased 18.4% this month, primarily driven by enterprise accounts and distributor sales."

Buttons:

"View Analysis"

"Ask AI"

---

# 7. ROLE-SPECIFIC DASHBOARDS

Dashboard content must adapt according to role.

BUSINESS OWNER:

* Full business KPIs
* Revenue
* Sales
* Leads
* Inventory
* Finance
* Marketing performance

SALES MANAGER:

* Team sales
* Leads
* Pipeline
* Conversion
* Sales targets
* Salesperson performance
* High-value opportunities

SALES EXECUTIVE:

* My Leads
* My Opportunities
* My Customers
* Follow-ups
* Quotations
* Today's tasks

MARKETING MANAGER:

* Campaign performance
* Social reach
* Engagement
* Leads generated
* Conversion
* Top-performing content

INVENTORY MANAGER:

* Inventory value
* Stock levels
* Low stock
* Stock movement
* Fast-moving products
* Warehouse status

PURCHASE MANAGER:

* Purchase orders
* Supplier performance
* Pending purchases
* Procurement value
* Reorder requirements

FINANCE MANAGER:

* Revenue
* Receivables
* Payables
* Invoices
* Expenses
* Cash flow

BUSINESS ANALYST:

* Analytics
* Trends
* KPIs
* Reports
* Read-only business intelligence

---

# 8. LEADS & PIPELINE — IMPORTANT PAGE

This is one of the most important pages.

It should NOT be just a Kanban board.

Make it a **Lead Acquisition & Sales Intelligence dashboard**.

Header:

"Leads & Pipeline"

Subtitle:

"Track prospects, opportunities, and business acquisition performance."

Primary button:

"+ Add Lead"

KPI cards:

* Total Leads
* New Leads
* Qualified Leads
* Pipeline Value
* Conversion Rate
* Social Media Leads
* Distributor Prospects

Charts:

### Lead Generation Trend

Line chart showing:

Jan → Feb → Mar → Apr → May → Jun

Metrics:

* New leads
* Qualified leads
* Converted leads

### Leads by Source

Sources:

* Instagram
* Facebook
* LinkedIn
* Website
* Sales Team
* Referral
* Events
* Email
* Other

### Lead Type Distribution

Types:

* Retailer
* Wholesaler
* Distributor
* Business
* Enterprise
* Social Lead
* Referral
* Other

### Conversion Funnel

New

↓

Contacted

↓

Qualified

↓

Proposal

↓

Negotiation

↓

Won

### Social Media Lead Performance

Show:

Campaign

Reach

Engagement

Enquiries

Leads

Qualified

Converted

Potential Revenue

Example:

"Wholesale Partner Campaign"

84,200 reach

6,420 engagement

1,280 clicks

184 enquiries

126 leads

48 qualified

12 converted

₹8.4L potential revenue

---

# 9. LEAD PIPELINE

Below analytics, create a Kanban pipeline.

Stages:

NEW

CONTACTED

QUALIFIED

PROPOSAL

NEGOTIATION

WON

LOST

Lead cards should contain:

* Company/prospect name
* Lead type
* Contact person
* Source
* Potential value
* Priority
* Assigned salesperson
* Last activity
* Next follow-up

Examples:

Acme Retail

Type: Retailer

Source: Website

Potential: ₹4.8L

Priority: High

Assigned: Rahul Sharma

---

# 10. LEAD DETAILS PAGE

Clicking a lead opens a complete Lead Details page.

Header:

Lead name

Company

Lead type

Status

Potential value

Assigned salesperson

Source

Buttons:

* Edit
* Convert
* Add Activity
* Create Quotation
* More

Sections:

### Lead Information

* Company
* Contact person
* Email
* Phone
* Location
* Industry
* Lead type
* Source
* Created date

### Opportunity

* Potential value
* Probability
* Expected closing date
* Product/category
* Sales stage

### Activity Timeline

Examples:

"Quotation sent"

"Follow-up call completed"

"Email opened"

"Meeting scheduled"

"Lead created from Instagram campaign"

### AI Lead Insight

Example:

"High-value distributor opportunity. Engagement is increasing and the prospect has requested pricing twice. Recommended next action: schedule a sales meeting."

---

# 11. CUSTOMERS PAGE

Customers represent established business accounts.

Header:

"Customers"

KPI cards:

* Total Business Accounts
* Active Customers
* New Customers
* Customer Revenue

Customer types:

* Retailer
* Wholesaler
* Distributor
* Business
* Enterprise

Table columns:

* Business
* Customer Type
* Contact Person
* Location
* Orders
* Revenue
* Outstanding
* Last Purchase
* Account Owner
* Status

Controls:

* Search
* Filter
* Customer Type
* Location
* Status
* Account Owner
* Export

Do not make this a list of every individual consumer transaction.

---

# 12. CUSTOMER DETAILS PAGE

Clicking a customer opens a detailed account profile.

Header:

Business name

Customer type

Contact person

Status

Account owner

Customer since

KPIs:

* Total Orders
* Revenue
* Average Order Value
* Outstanding

Tabs:

* Overview
* Orders
* Activities
* Invoices
* Documents
* Notes

Overview:

Contact Information

Company Information

Customer Health

Recent Activity

AI Customer Insight

Example:

"Customer health is excellent. Purchase frequency increased 14% over the last quarter."

---

# 13. SALES ORDERS PAGE

Create order management.

KPI cards:

* Total Orders
* Pending
* Processing
* Completed
* Order Value

Table:

Order ID

Customer

Items

Amount

Date

Payment

Status

Actions

Statuses:

* Draft
* Confirmed
* Processing
* Shipped
* Delivered
* Cancelled

---

# 14. ORDER DETAILS

Show:

Order ID

Customer

Order date

Salesperson

Billing address

Shipping address

Products

Quantity

Price

Discount

Tax

Total

Payment status

Fulfillment status

Timeline

Buttons:

* Edit
* Print
* Invoice
* Cancel

---

# 15. QUOTATIONS PAGE

Create quotation management.

Show:

* Quotation ID
* Prospect/customer
* Products
* Value
* Expiry
* Salesperson
* Status

Statuses:

Draft

Sent

Viewed

Accepted

Rejected

Expired

Actions:

* Create quotation
* Send
* Download
* Convert to order

---

# 16. PRODUCTS PAGE

Product catalogue.

KPI cards:

* Total Products
* Active Products
* Low Stock Products
* Product Categories

Table:

SKU

Product

Category

Price

Stock

Supplier

Status

Actions

Add Product button.

---

# 17. PRODUCT DETAILS

Show:

Product image placeholder

Product name

SKU

Category

Price

Cost

Margin

Current stock

Reorder level

Supplier

Sales performance

Purchase history

Inventory movement

AI product insight

---

# 18. INVENTORY PAGE

Inventory dashboard.

KPIs:

* Inventory Value
* Total Items
* Low Stock
* Out of Stock
* Stock Movement

Charts:

* Inventory Trend
* Stock by Category
* Fast Moving Products
* Slow Moving Products

Table:

Product

SKU

Warehouse

Current Stock

Reserved

Available

Reorder Level

Status

---

# 19. PURCHASES PAGE

Purchase management.

KPIs:

* Purchase Orders
* Pending
* Received
* Purchase Value
* Pending Value

Table:

PO Number

Supplier

Items

Amount

Order Date

Expected Date

Status

---

# 20. SUPPLIERS PAGE

Supplier database.

Fields:

Supplier

Contact

Category

Products

Orders

Total Purchase

Outstanding

Performance

Status

Supplier rating.

---

# 21. FINANCE DASHBOARD

Create finance overview.

KPIs:

* Revenue
* Receivables
* Payables
* Expenses
* Net Profit
* Cash Flow

Charts:

* Revenue vs Expenses
* Cash Flow
* Receivables Aging
* Payables Aging

---

# 22. INVOICES PAGE

Table:

Invoice ID

Customer

Amount

Issue Date

Due Date

Payment Status

Actions

Statuses:

* Draft
* Sent
* Paid
* Partially Paid
* Overdue

---

# 23. PAYMENTS PAGE

Show:

* Payment ID
* Customer
* Invoice
* Amount
* Method
* Date
* Status

Payment methods:

* Bank Transfer
* UPI
* Card
* Cash
* Other

---

# 24. EXPENSES PAGE

Show:

* Expense ID
* Category
* Amount
* Date
* Department
* Submitted by
* Status

Categories:

* Operations
* Marketing
* Travel
* Salaries
* Procurement
* Utilities
* Other

---

# 25. MARKETING / SOCIAL CONTENT PAGE

This is directly connected to Leads.

Header:

"Social Content"

Create content cards/posts.

Platforms:

* Instagram
* Facebook
* LinkedIn

Content statuses:

* Draft
* Scheduled
* Published

Show:

* Reach
* Engagement
* Clicks
* Enquiries
* Leads Generated

Create Content button.

---

# 26. SOCIAL CONTENT DETAILS

Show:

Campaign/content title

Platform

Post preview

Publish date

Reach

Likes

Comments

Shares

Clicks

Enquiries

Leads

Qualified leads

Conversions

Revenue attributed

AI Content Insight.

Example:

"This campaign generated 42% more qualified leads than the previous campaign."

Button:

"View Generated Leads"

Clicking it opens filtered Leads page showing leads generated by that content.

---

# 27. CAMPAIGNS PAGE

Campaign dashboard.

KPIs:

* Active Campaigns
* Total Reach
* Engagement
* Leads Generated
* Conversion
* Attributed Revenue

Campaign table:

Campaign

Platform

Start Date

End Date

Reach

Leads

Conversions

Revenue

ROI

---

# 28. ANALYTICS PAGE

Create a powerful business analytics dashboard.

Sections:

### Sales Analytics

Revenue trend

Sales by region

Sales by salesperson

Top products

Top customers

### CRM Analytics

Lead growth

Conversion funnel

Lead sources

Sales pipeline

### Marketing Analytics

Campaign performance

Social leads

Content performance

### Inventory Analytics

Stock turnover

Fast-moving products

Slow-moving products

### Finance Analytics

Revenue

Expenses

Profit

Receivables

Payables

Allow date filters:

Today

7 Days

30 Days

3 Months

6 Months

1 Year

Custom

---

# 29. DOCUMENTS PAGE

Document management.

Categories:

* Invoices
* Quotations
* Purchase Orders
* Contracts
* Reports
* Business Documents

Functions:

Upload

Search

Filter

Preview

Download

Delete if permitted

Show document metadata.

Include a "Process with AI" button.

---

# 30. AI ASSISTANT

Create a ChatGPT-style business assistant.

Title:

"BizNexuz AI"

Subtitle:

"Ask questions about your business data and documents."

Example questions:

"What were our top-selling products last month?"

"Which leads have the highest conversion probability?"

"Which customers have overdue payments?"

"Which social campaign generated the most qualified leads?"

"Show me low-stock products."

"What was our revenue growth this quarter?"

"Summarize the latest supplier report."

Chat interface:

User message

AI response

Source references

Suggested follow-up questions

Use a polished AI UI.

Include:

* New conversation
* Chat history
* Search
* Clear conversation

AI responses should visually distinguish:

* Business database information
* Uploaded document information
* AI-generated recommendations

---

# 31. DOCUMENT RAG FLOW

Prototype the RAG workflow.

Flow:

Upload document

↓

Document processing

↓

Text extraction

↓

Chunking

↓

Embedding

↓

Vector database

↓

AI retrieval

↓

Answer with sources

Show a processing state:

"Processing document..."

Then:

"Document indexed successfully."

AI answer should show source references such as:

"Source: Q2 Sales Report.pdf"

---

# 32. USERS & ROLES — RBAC

This is an important Admin feature.

Business Owner/Super Admin should have complete authority over access.

Page title:

"Users & Roles"

KPIs:

* Active Users
* Roles
* Custom Permissions
* Pending Invitations

User table:

User

Role

Department

Access Scope

Status

Actions

Example users:

Arjun Mehta — Sales Manager

Priya Shah — Marketing Manager

Rahul Sharma — Sales Executive

Neha Patel — Finance Manager

Vikram Rao — Inventory Manager

Aisha Khan — Business Analyst

Actions:

* Edit User
* Manage Permissions
* Disable User
* Reset Access

---

# 33. ROLE MANAGEMENT

Allow Business Owner to:

* Create role
* Edit role
* Delete role
* Duplicate role
* Assign users

Example roles:

Business Owner

Sales Manager

Sales Executive

Marketing Manager

Inventory Manager

Purchase Manager

Finance Manager

Business Analyst

---

# 34. GRANULAR PERMISSIONS

Permission matrix.

Columns:

Module

View

Create

Edit

Delete

Export

Approve

Modules:

Dashboard

Leads

Customers

Sales

Quotations

Products

Inventory

Purchases

Suppliers

Finance

Marketing

Analytics

Documents

AI Assistant

Users & Roles

Settings

Use checkboxes/toggles.

---

# 35. INDIVIDUAL USER OVERRIDES

Business Owner must be able to override role permissions for a specific user.

Example:

Rahul Sharma

Role:

Sales Executive

Default permissions:

Leads → View/Create/Edit

Customers → View/Create/Edit

Sales Orders → View/Create

Then show:

"Individual Overrides"

Additional permission:

Customers → Export

This demonstrates that permissions can be customized per individual user without changing the role.

Show:

Role permissions

*

Individual overrides

=

Effective permissions

---

# 36. RBAC BEHAVIOUR

The prototype must demonstrate:

If Business Owner logs in:

Show all modules.

If Sales Manager logs in:

Show:

Dashboard

CRM

Sales

Analytics

AI

Hide:

Finance administration

Purchasing administration

User management

If Sales Executive logs in:

Show:

Dashboard

My Leads

My Customers

Sales Orders

Quotations

AI

Only show assigned records where appropriate.

If Finance Manager logs in:

Show:

Dashboard

Finance

Invoices

Payments

Expenses

Analytics

AI

Hide:

Marketing management

Inventory management

User management

---

# 37. ACCESS DENIED STATE

If a user attempts to access a page without permission, show:

"Access Restricted"

"You don't have permission to access this module."

Button:

"Return to Dashboard"

Do not simply rely on hiding navigation.

---

# 38. NOTIFICATIONS

Create notification dropdown.

Examples:

"New distributor lead received."

"Invoice #INV-2048 is overdue."

"Stock for Product A is below reorder level."

"New social campaign generated 12 leads."

"Quotation #QT-1082 was accepted."

---

# 39. GLOBAL SEARCH

Global search should visually search across:

* Customers
* Leads
* Products
* Orders
* Invoices
* Suppliers
* Documents

Show grouped results.

Example:

SEARCH: "Acme"

Customers
Acme Corporation

Leads
Acme Retail Prospect

Orders
ORD-1048

Documents
Acme Contract.pdf

---

# 40. COMMON UI INTERACTIONS

Make the prototype interactive.

Buttons should work.

Navigation should work.

Tables should open detail pages.

Cards should open related pages.

Search should update visible data.

Filters should visibly change results.

Tabs should switch content.

Kanban cards should open Lead Details.

"View Generated Leads" should open Leads filtered by campaign.

"Convert Lead" should show a conversion confirmation.

"Create Quotation" should open quotation form.

"Create Order" should open order form.

"Upload Document" should show upload/processing state.

"Ask AI" should open AI Assistant with a contextual question.

---

# 41. FORMS

Create realistic forms for:

Add Lead

Add Customer

Add Product

Create Quotation

Create Sales Order

Add Supplier

Create Purchase Order

Create Invoice

Add Expense

Create Campaign

Invite User

Create Role

Forms should have:

Labels

Inputs

Dropdowns

Date pickers

Validation states

Cancel

Save

Save & Continue

---

# 42. DATA MODEL FOR PROTOTYPE

Use realistic interconnected sample data.

Customers:

Acme Corporation

NovaTech Industries

Orbit Technologies

Vertex Solutions

Apex Retail

CloudPeak Labs

Zenith Digital

Greenfield Co.

Leads:

Acme Retail Prospect

ABC Wholesale

Nova Distributor

Brightline Systems

Northstar Retail

Social Campaign leads

Products:

Enterprise CRM Suite

Business Analytics Pro

Inventory Management Module

AI Assistant Pro

Cloud ERP Package

Suppliers:

TechSource India

Global Components

Prime Distribution

Finance data should correspond with orders/customers.

Lead data should correspond with campaigns.

Orders should correspond with customers.

Invoices should correspond with orders.

Inventory should correspond with products.

This should make the prototype feel like one connected application rather than separate screens.

---

# 43. AI-GENERATED INSIGHTS

Use realistic AI insight cards throughout the application.

Examples:

Sales:

"Sales are up 18.4% compared with last month."

Leads:

"Distributor leads have the highest average potential value."

Marketing:

"LinkedIn campaigns are generating fewer leads but higher-value opportunities."

Inventory:

"Product X may reach reorder level within 8 days."

Finance:

"₹4.2L in invoices are overdue."

Customers:

"Acme Corporation has increased purchase frequency by 14%."

Use a small AI icon and purple intelligence styling.

---

# 44. RESPONSIVE BEHAVIOUR

Desktop should be the primary prototype.

Also make layouts reasonably responsive:

Desktop:

1440px

Tablet:

1024px

Mobile:

390px

On smaller screens:

* Collapse sidebar
* Use mobile navigation
* Stack KPI cards
* Convert tables to cards
* Stack charts
* Keep primary actions accessible

---

# 45. EMPTY STATES

Every major page should have a polished empty state.

Example:

"No leads found"

"Try changing your filters or create a new lead."

Button:

"+ Add Lead"

---

# 46. LOADING STATES

Include skeleton loaders for:

Dashboard

Tables

Charts

AI responses

Document processing

---

# 47. ERROR STATES

Include:

* Failed data loading
* Invalid form
* Unauthorized access
* Failed document processing
* AI unavailable
* Network error

Use concise professional messages.

---

# 48. PROTOTYPE DEMO FLOW

The prototype should support this complete demonstration:

LOGIN

↓

Business Owner Dashboard

↓

Leads & Pipeline

↓

View Lead Analytics

↓

View Social Media Lead Source

↓

Open Lead

↓

View AI Lead Insight

↓

Convert Lead

↓

Customer Account

↓

Create Quotation

↓

Sales Order

↓

Inventory updated

↓

Invoice generated

↓

Payment recorded

↓

Analytics updated

This should feel like one connected business workflow.

---

# 49. MARKETING → CRM FLOW

Demonstrate:

Admin/Marketing Manager creates social content

↓

Content published

↓

Engagement generated

↓

Prospects enquire

↓

Leads created

↓

Leads appear in CRM

↓

Sales team follows up

↓

Qualified opportunity

↓

Quotation

↓

Won

↓

Customer

↓

Revenue attributed to campaign

This is a core differentiator of BizNexuz.

---

# 50. RBAC DEMO FLOW

Demonstrate:

Business Owner

↓

Users & Roles

↓

Select Sales Executive

↓

View permissions

↓

Grant "Customer Export"

↓

Save

↓

Switch user to Sales Executive

↓

Customer page now shows Export action

Then revoke permission.

The Export action disappears.

This should visibly demonstrate dynamic authority control.

---

# 51. NAVIGATION RULE

Use consistent routing/page hierarchy.

Example:

/login

/dashboard

/crm/leads

/crm/leads/:id

/crm/customers

/crm/customers/:id

/sales/orders

/sales/orders/:id

/sales/quotations

/inventory/products

/inventory/products/:id

/inventory

/purchases

/suppliers

/finance

/finance/invoices

/finance/payments

/finance/expenses

/marketing/social

/marketing/campaigns

/analytics

/documents

/ai-assistant

/settings/users

/settings/roles

/settings/permissions

---

# 52. IMPORTANT PROTOTYPE PRIORITY

Prioritize functional interaction over creating hundreds of perfect static screens.

The most important fully connected flows are:

1. Login + RBAC

2. Business Owner Dashboard

3. Leads Analytics + Pipeline

4. Lead Details

5. Customers

6. Customer Details

7. Social Content → Leads

8. Sales Order

9. Inventory

10. Finance

11. AI Assistant

12. Documents/RAG

13. Users & Roles

14. Permission Management

15. Individual User Overrides

Other pages can use consistent reusable layouts.

---

# 53. COMPONENT SYSTEM

Create reusable components for:

* Sidebar
* Topbar
* KPI Card
* Chart Card
* Data Table
* Table Row
* Status Badge
* Priority Badge
* User Avatar
* Customer Avatar
* Lead Card
* Kanban Column
* Modal
* Drawer
* Form Input
* Dropdown
* Date Picker
* Tabs
* Pagination
* Toast
* Notification
* AI Insight Card
* AI Chat Message
* Permission Toggle
* Empty State
* Loading Skeleton
* Access Denied

Maintain consistent styling across all pages.

---

# 54. FINAL PRODUCT FEEL

BizNexuz should feel like a serious enterprise product.

Do NOT make it look like:

* A student dashboard
* A generic admin template
* A simple CRUD application
* A collection of unrelated pages

It should communicate:

"One intelligent platform connecting customer acquisition, sales, operations, finance, marketing, documents, analytics, and AI."

The most important visual story is:

SOCIAL CONTENT

↓

LEADS

↓

PIPELINE

↓

CUSTOMERS

↓

SALES

↓

INVENTORY

↓

FINANCE

↓

ANALYTICS

↓

AI INSIGHTS

And RBAC controls:

USER

↓

ROLE

↓

PERMISSIONS

↓

AVAILABLE MODULES

↓

AVAILABLE ACTIONS

Build the prototype with realistic data, connected interactions, polished states, and a consistent BizNexuz design system.
