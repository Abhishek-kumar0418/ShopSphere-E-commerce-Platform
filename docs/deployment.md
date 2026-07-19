# Deployment Guide

ShopSphere can be deployed as a single Express service that serves both the REST API and the static frontend. You can also host `frontend/` separately and point it at the API by changing the `API` constant in `frontend/assets/app.js`.

## Backend Deployment

Recommended targets include Render, Railway, Fly.io, AWS ECS, Azure App Service, DigitalOcean App Platform, or any Node-capable container platform.

1. Provision a MySQL 8 compatible database.
2. Set production environment variables:

```text
PORT=4000
NODE_ENV=production
DB_HOST=<mysql-host>
DB_PORT=3306
DB_USER=<mysql-user>
DB_PASSWORD=<mysql-password>
DB_NAME=commerce_db
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=7d
FRONTEND_ORIGIN=https://your-frontend-domain.com
TAX_RATE=0.18
SHIPPING_FLAT=49
```

If the backend serves the frontend from the same domain, set `FRONTEND_ORIGIN` to that deployed domain. For multiple origins, use a comma-separated value.

3. Install dependencies from `backend/`.

```bash
npm ci
```

4. Load the schema and seed data.

From the repository root:

```bash
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < backend/database/schema.sql
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < backend/database/seed.sql
```

From `backend/`, you can also run:

```bash
node setup-db.js
```

Use seed data only for demos or initial development environments. For production, load the schema and create real admin users through a controlled process.

5. Start the server.

```bash
npm start
```

6. Verify:

```bash
curl https://your-api-domain.com/health
```

Expected response:

```json
{ "status": "ok" }
```

## Frontend Deployment

The backend serves `frontend/index.html` and assets automatically from the Express app.

For separate static hosting, deploy `frontend/` to Netlify, Vercel, Cloudflare Pages, S3 + CloudFront, or Nginx. Then update the `API` constant in `frontend/assets/app.js` to the production API base URL, for example:

```js
const API = "https://your-api-domain.com/api";
```

Also set `FRONTEND_ORIGIN` on the backend to the static frontend domain.

## Database Notes

- `backend/database/schema.sql` drops and recreates all tables. Do not run it blindly against production data.
- Add a real migration system before maintaining a long-lived production database.
- Enable automated backups and test restores.
- Use a dedicated least-privilege database user for the application.
- Use connection limits that match your hosting plan and MySQL capacity.

## Security Checklist

- Use HTTPS for every production domain.
- Set a strong `JWT_SECRET`; never commit real secrets.
- Restrict CORS with `FRONTEND_ORIGIN`.
- Keep Helmet and rate limiting enabled.
- Keep `NODE_ENV=production` in deployed environments.
- Store database credentials in the host secret manager.
- Rotate database passwords and JWT secrets when needed.
- Add audit logging for admin product, order, and user changes.
- Replace demo seed users before public access.

## Payments

The project includes the Stripe package, but the current checkout flow records a local payment status in `payment_records`. Before accepting real payments:

- Use a PCI-compliant hosted payment flow.
- Store provider payment IDs in `transaction_ref`.
- Verify provider webhooks server-side.
- Update order and payment statuses from verified webhook events.

## Scaling Checklist

- Add migrations with Prisma, Knex, Sequelize, or Umzug.
- Use Redis for rate-limit storage, carts, and frequently accessed catalog data if needed.
- Add MySQL FULLTEXT search or OpenSearch for larger catalogs.
- Move invoice generation and email notifications to background workers.
- Put static frontend assets and product images behind a CDN.
- Add automated tests and CI before deploying frequent changes.
