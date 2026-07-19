# API Documentation

Base URL: `http://localhost:4000/api`

Authentication accepts either:

- `Authorization: Bearer <jwt>`
- HTTP-only `token` cookie set by `POST /login`

Most customer and admin routes require authentication. Admin routes require a user with `role = "admin"`.

## Health

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/health` | Public | Server health check. This route is outside `/api`. |

## Authentication

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/register` | Public | Creates a customer account. |
| POST | `/login` | Public | Returns a JWT and sets an HTTP-only `token` cookie. |
| POST | `/logout` | Public | Clears the auth cookie. |
| GET | `/profile` | Customer/Admin | Returns the current user profile. |
| PUT | `/profile` | Customer/Admin | Updates the current user's name and phone. |

Register body:

```json
{
  "full_name": "Demo Customer",
  "email": "customer@example.com",
  "phone": "+918888888888",
  "password": "Password123!",
  "confirm_password": "Password123!"
}
```

Login body:

```json
{
  "email": "customer@example.com",
  "password": "Password123!",
  "remember_me": true
}
```

## Products

Mounted at `/products`.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/products` | Public | Lists products with filters, sorting, and pagination. |
| GET | `/products/:id` | Public | Returns one product, reviews, and related products. |
| POST | `/products` | Admin | Creates a product. |
| PUT | `/products/:id` | Admin | Replaces editable product fields. |
| DELETE | `/products/:id` | Admin | Deletes a product. |

Supported list query parameters:

| Parameter | Description |
| --- | --- |
| `page` | Page number, default `1`. |
| `limit` | Page size, default `12`, max `50`. |
| `search` | Matches product name or description. |
| `category` | Exact category name. |
| `min_price` | Minimum product price. |
| `max_price` | Maximum product price. |
| `rating` | Minimum average rating. |
| `sort` | `latest`, `price_asc`, `price_desc`, or `rating`. |

Example:

```text
/api/products?search=watch&category=Electronics&min_price=1000&max_price=9000&rating=4&sort=price_asc&page=1&limit=12
```

Product body:

```json
{
  "name": "AeroFit Smart Watch",
  "description": "Fitness watch with AMOLED display.",
  "specifications": {
    "display": "AMOLED",
    "gps": "Built-in"
  },
  "price": 6999,
  "discount_percent": 10,
  "stock": 35,
  "image": "https://example.com/watch.jpg",
  "images": ["https://example.com/watch.jpg"],
  "category_id": 1,
  "is_featured": true,
  "is_best_seller": false
}
```

## Categories

Mounted at `/categories`.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/categories` | Public | Lists categories. |
| POST | `/categories` | Admin | Creates a category. |
| PUT | `/categories/:id` | Admin | Updates a category name. |
| DELETE | `/categories/:id` | Admin | Deletes a category. |

Category body:

```json
{
  "category_name": "Electronics"
}
```

## Addresses

Mounted at `/addresses`.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/addresses` | Customer/Admin | Lists addresses for the authenticated user. |
| POST | `/addresses` | Customer/Admin | Creates an address for the authenticated user. |

Address body:

```json
{
  "label": "Home",
  "line1": "221 Market Street",
  "line2": "",
  "city": "Bengaluru",
  "state": "Karnataka",
  "postal_code": "560001",
  "country": "India"
}
```

## Cart

Mounted at `/cart`.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/cart` | Customer/Admin | Returns cart items and totals. |
| POST | `/cart/add` | Customer/Admin | Adds an item or increments quantity. |
| PUT | `/cart/update` | Customer/Admin | Updates quantity for a product. |
| DELETE | `/cart/remove` | Customer/Admin | Removes a product from the cart. |

Cart body:

```json
{
  "product_id": 1,
  "quantity": 2
}
```

## Orders

Mounted at `/orders`.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/orders` | Customer/Admin | Creates an order from the authenticated user's cart. |
| GET | `/orders` | Customer/Admin | Customers see their own orders; admins see all orders. |
| GET | `/orders/:id` | Customer/Admin | Returns order detail and line items. |
| GET | `/orders/:id/invoice` | Customer/Admin | Downloads a plain-text invoice. |
| PUT | `/orders/status` | Admin | Updates an order status. |

Create order body:

```json
{
  "shipping_address_id": 1,
  "billing_address_id": 1,
  "payment_method": "upi",
  "coupon_code": "WELCOME10"
}
```

Update status body:

```json
{
  "order_id": 1,
  "status": "Shipped"
}
```

Allowed statuses:

- `Pending`
- `Confirmed`
- `Processing`
- `Shipped`
- `Delivered`
- `Cancelled`

## Admin

Mounted at `/admin`.

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| GET | `/admin/stats` | Admin | Returns revenue, order counts, user counts, product counts, and low-stock totals. |
| GET | `/admin/users` | Admin | Lists users for admin management views. |

## Validation

Request bodies are cleaned with `xss` and validated with Joi. Unknown fields are stripped. Validation failures return `422`.

## Status Codes

| Code | Meaning |
| --- | --- |
| `200` | Success |
| `201` | Created |
| `204` | Deleted/no content |
| `400` | Bad request |
| `401` | Authentication required |
| `403` | Forbidden |
| `404` | Not found |
| `409` | Conflict, such as insufficient stock |
| `422` | Validation error |
| `500` | Server error |
