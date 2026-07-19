# ShopSphere E-Commerce Platform

ShopSphere is a responsive e-commerce starter with a vanilla HTML/CSS/JavaScript storefront and an Express.js REST API backed by MySQL. The backend serves the frontend from the same server, so a local run can work from one port while still keeping `frontend/` and `backend/` clearly separated.

## Features

- Customer registration, login, logout, JWT auth, and profile management.
- Public product catalog with search, category filtering, price filtering, rating filtering, sorting, and pagination.
- Product detail pages with reviews and related products.
- Category browsing and admin category management.
- Authenticated cart with add, update, remove, tax, and shipping totals.
- Address book for shipping and billing addresses.
- Checkout flow that creates orders, decrements stock, records payment status, applies coupons, and clears the cart.
- Order history, order details, and text invoice downloads.
- Admin product CRUD, user listing, order status updates, and sales statistics.
- MySQL schema and seed data for users, products, categories, cart, orders, payments, addresses, wishlist, reviews, and coupons.
- Security middleware for Helmet, CORS, rate limiting, input validation, XSS cleanup, bcrypt password hashing, and JWT cookies.

## Tech Stack

- Frontend: vanilla HTML, CSS, and JavaScript
- Backend: Node.js, Express, ES modules
- Database: MySQL with `mysql2/promise`
- Auth: JWT in `Authorization: Bearer <token>` or HTTP-only `token` cookie
- Validation: Joi
- Security and observability: Helmet, CORS, rate limiting, Morgan, compression, cookie-parser

## Project Structure

```text
ecommerce-platform/
  README.md
  backend/
    .env.example
    package.json
    setup-db.js
    database/
      schema.sql
      seed.sql
    src/
      config/
      controllers/
      middleware/
      routes/
      utils/
  frontend/
    index.html
    assets/
      app.js
      styles.css
      images/
  docs/
    api.md
    deployment.md
    er-diagram.md
```

## Requirements

- Node.js 18 or newer
- npm
- MySQL 8 or compatible MySQL server

## Quick Start

1. Configure the backend environment.

```bash
cd backend
copy .env.example .env
```

Update `.env` with your MySQL credentials and a strong `JWT_SECRET`.

2. Install backend dependencies.

```bash
npm install
```

3. Create and seed the database.

Option A, use the setup helper:

```bash
node setup-db.js
```

Option B, run SQL manually:

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS commerce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
mysql -u root -p commerce_db < database/schema.sql
mysql -u root -p commerce_db < database/seed.sql
```

4. Start the app.

```bash
npm run dev
```

Open `http://localhost:4000`.

## Seed Accounts

Both seed accounts use the password `Password123!`.

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@example.com` | `Password123!` |
| Customer | `customer@example.com` | `Password123!` |

Seed coupons:

| Code | Discount |
| --- | --- |
| `WELCOME10` | 10% |
| `FESTIVE15` | 15% |

## Backend Scripts

Run these from `backend/`.

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the API with Nodemon on `PORT` or `4000`. |
| `npm start` | Starts the API with Node. |
| `npm run db:schema` | Loads `database/schema.sql` into `commerce_db`. |
| `npm run db:seed` | Loads `database/seed.sql` into `commerce_db`. |
| `node setup-db.js` | Creates the database, loads schema, and loads seed data using `.env` values. |

## Environment Variables

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `4000` | Express server port. |
| `NODE_ENV` | `development` | Use `production` for deployed environments. |
| `DB_HOST` | `localhost` | MySQL host. |
| `DB_PORT` | `3306` | MySQL port. |
| `DB_USER` | `root` | MySQL user. |
| `DB_PASSWORD` | Local fallback in code | MySQL password. Set this explicitly. |
| `DB_NAME` | `commerce_db` | MySQL database name. |
| `JWT_SECRET` | none | Secret used to sign JWTs. Required for real deployments. |
| `JWT_EXPIRES_IN` | `7d` | JWT lifetime. |
| `FRONTEND_ORIGIN` | unrestricted CORS fallback | Comma-separated allowed frontend origins. |
| `TAX_RATE` | `0.18` | Tax rate applied at checkout. |
| `SHIPPING_FLAT` | `49` | Flat shipping amount applied at checkout. |

## API Documentation

Base API URL: `http://localhost:4000/api`

The backend also exposes:

- `GET /` - serves `frontend/index.html`
- `GET /health` - returns `{ "status": "ok" }`

See [docs/api.md](docs/api.md) for route details.

## Database

The schema is defined in `backend/database/schema.sql`. The ER diagram is documented in [docs/er-diagram.md](docs/er-diagram.md).

Main tables:

- `users`
- `categories`
- `products`
- `user_addresses`
- `cart`
- `orders`
- `order_items`
- `payment_records`
- `reviews`
- `wishlist`
- `coupons`

## Deployment

See [docs/deployment.md](docs/deployment.md) for production setup, environment variables, database loading, frontend hosting options, and security notes.

## Notes and Next Steps

- Product images in seed data use remote image URLs; `frontend/assets/images/` contains local assets that can be wired in if you want an offline-friendly demo.
- The Stripe dependency is installed, but checkout currently records payment intent/status locally instead of completing a live Stripe payment flow.
- Add automated tests for auth, checkout transactions, admin permissions, and stock updates before production use.
- Add migrations with a tool such as Prisma, Knex, Sequelize, or Umzug before managing long-lived production databases.
