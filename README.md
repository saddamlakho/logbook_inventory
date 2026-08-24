# Inventory Management System

Complete Inventory Management built with **Next.js 15**, **Tailwind CSS**, **PostgreSQL** (via pgAdmin), and **Server Actions**.

## Features

- Admin Login (JWT-based auth)
- Dashboard with stats & low stock alerts
- Product CRUD (Create, Read, Update, Delete)
- Stock In (Add stock with reason & reference)
- **Stock Out / Issue** (Receiver name, department, issuer name & signature)
- Transaction History (All stock movements)
- **Printable Issuance Report** (Date range, department, product filters)
- Low Stock Alerts

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + Tailwind CSS |
| Backend | Next.js Server Actions |
| Database | PostgreSQL (pgAdmin) |
| Auth | JWT (jose) + bcryptjs |
| UI | Lucide React icons |

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup PostgreSQL (pgAdmin)

1. Open **pgAdmin**
2. Create a new database: `inventory_db`
3. Open **Query Tool** for `inventory_db`
4. Copy & paste the contents of `sql/schema.sql`
5. Click **Execute** (F5)

> This creates all tables + sample data (admin user, categories, products, sample transactions)

### 3. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=inventory_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=change-this-to-a-random-string
```

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Login

| Field | Value |
|-------|-------|
| Email | `admin@inventory.com` |
| Password | `admin123` |

## Project Structure

```
inventory-app/
├── app/
│   ├── login/page.tsx          # Login page
│   ├── page.tsx                # Dashboard
│   ├── products/
│   │   ├── page.tsx            # Product list
│   │   ├── new/page.tsx        # Add product
│   │   └── [id]/page.tsx       # Edit product
│   ├── stock-in/page.tsx       # Stock In form
│   ├── stock-out/page.tsx      # Stock Out / Issue form
│   ├── transactions/page.tsx   # Transaction history
│   └── reports/page.tsx        # Printable issuance report
├── components/
│   ├── Navbar.tsx              # Sidebar navigation
│   └── DeleteProductButton.tsx # Delete with confirm
├── lib/
│   ├── db.ts                   # PostgreSQL pool
│   ├── auth.ts                 # JWT auth utilities
│   └── actions.ts              # All Server Actions
├── types/
│   └── index.ts                # TypeScript interfaces
├── sql/
│   └── schema.sql              # Database setup
├── middleware.ts               # Route protection
└── .env.example                # Environment template
```

## Stock Out Form Fields

When issuing stock, the system records:
- **Product** & **Quantity**
- **Receiver Name** (lene wale ka naam)
- **Department** (IT, HR, Finance, etc.)
- **Purpose** (kis liye liya)
- **Issuer Name** (dene wale ka naam)
- **Issuer Signature** (sign/initials)
- **Issue Date**

## Issuance Report

Go to **Issuance Report** page to:
- Filter by date range
- Filter by department
- Filter by product
- **Print** the report (Ctrl+P or Print button)

Print view hides all UI buttons and shows a clean table.

## License

MIT
