# System Architecture – Sri Ceylon Porcelain

## 1. Overview

The system consists of two independently deployed applications:

1. **Storefront (Public Website)**
2. **ERP (Internal Business System)**

These systems are logically and infrastructurally separated.

The ERP is the source of truth for all business data.

---

## 2. High-Level Architecture

User
↓
Storefront (Next.js on Vercel)
↓ GraphQL API (HTTPS)
ERP (Next.js + Node on VPS)
↓
PostgreSQL Database

---

## 3. Storefront Architecture

### Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- React Compiler
- Hosted on Vercel
- Firebase Authentication (Customer login)

### Responsibilities

- Product browsing (SSG + ISR)
- Cart management (client-side)
- Checkout initiation
- Calling ERP GraphQL API
- Displaying stock availability
- SEO optimization

### Rendering Strategy

- Product pages: Static Site Generation (SSG)
- Incremental Static Regeneration (ISR)
- On-demand revalidation triggered by ERP

Storefront does NOT:
- Own inventory
- Perform financial calculations
- Modify stock directly
- Access database directly

---

## 4. ERP Architecture

### Stack

- Next.js (Admin UI)
- Node.js backend
- GraphQL API
- PostgreSQL
- Hosted on VPS

### Responsibilities

- Product management
- Inventory management
- Order processing
- Finance/accounting logic
- Customer record ownership
- Staff authentication

ERP is the source of truth.

All business logic lives inside ERP.

---

## 5. Authentication Strategy

### Customers

- Authenticate using Firebase
- Firebase ID token sent to ERP
- ERP verifies token server-side
- ERP creates/links customer record

### Staff

- Separate ERP authentication system
- Role-based access control
- No Firebase usage for ERP staff

---

## 6. Data Ownership Rules

- ERP owns all persistent business data.
- Storefront consumes data via API.
- Storefront never connects directly to ERP database.
- No shared database between systems.

---

## 7. Deployment Model

### Storefront

- Hosted on Vercel
- Production branch: `main`
- Automatic deployment on merge to `main`

### ERP

- Hosted on VPS
- Manual or CI deployment
- Separate environment from storefront

---

## 8. Product Update Flow

1. Admin updates product in ERP
2. ERP updates PostgreSQL
3. ERP triggers Storefront revalidation endpoint
4. Next.js regenerates affected pages
5. CDN updates content

No full rebuild required.

---

## 9. Order Flow

1. Customer places order
2. Storefront sends request to ERP API
3. ERP validates stock inside database transaction
4. ERP creates order and deducts stock
5. Response returned to Storefront

Stock enforcement happens only inside ERP.

---

## 10. Future Scalability

- Storefront and ERP scale independently.
- ERP can later support mobile app, POS, or B2B portal.
- Storefront can be replaced without affecting ERP.

---

## 11. Security Principles

- HTTPS only
- API secret between Storefront and ERP
- No public database access
- Role-based access for ERP users
- No business logic in Storefront

---

© 2026 MALIBU PIXEL PVT LTD