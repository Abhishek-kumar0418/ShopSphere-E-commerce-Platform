# ER Diagram

This diagram mirrors `backend/database/schema.sql`.

```mermaid
erDiagram
  USERS ||--o{ USER_ADDRESSES : owns
  USERS ||--o{ CART : has
  USERS ||--o{ ORDERS : places
  USERS ||--o{ REVIEWS : writes
  USERS ||--o{ WISHLIST : saves
  CATEGORIES ||--o{ PRODUCTS : groups
  PRODUCTS ||--o{ CART : added_to
  PRODUCTS ||--o{ ORDER_ITEMS : sold_as
  PRODUCTS ||--o{ REVIEWS : receives
  PRODUCTS ||--o{ WISHLIST : saved_as
  ORDERS ||--o{ ORDER_ITEMS : contains
  ORDERS ||--o{ PAYMENT_RECORDS : records
  USER_ADDRESSES ||--o{ ORDERS : shipping_address
  USER_ADDRESSES ||--o{ ORDERS : billing_address

  USERS {
    int id PK
    varchar full_name
    varchar email UK
    varchar phone UK
    text password_hash
    enum role
    timestamp created_at
  }

  CATEGORIES {
    int id PK
    varchar category_name UK
  }

  PRODUCTS {
    int id PK
    varchar name
    text description
    json specifications
    decimal price
    decimal discount_percent
    int stock
    text image
    json images
    int category_id FK
    boolean is_featured
    boolean is_best_seller
    timestamp created_at
  }

  USER_ADDRESSES {
    int id PK
    int user_id FK
    varchar label
    text line1
    text line2
    varchar city
    varchar state
    varchar postal_code
    varchar country
    timestamp created_at
  }

  CART {
    int id PK
    int user_id FK
    int product_id FK
    int quantity
  }

  ORDERS {
    int id PK
    int user_id FK
    decimal total_amount
    decimal tax_amount
    decimal shipping_amount
    decimal discount_amount
    enum status
    int shipping_address_id FK
    int billing_address_id FK
    timestamp order_date
  }

  ORDER_ITEMS {
    int id PK
    int order_id FK
    int product_id FK
    int quantity
    decimal price
  }

  PAYMENT_RECORDS {
    int id PK
    int order_id FK
    decimal amount
    enum payment_method
    varchar status
    varchar transaction_ref
    timestamp paid_at
    timestamp created_at
  }

  REVIEWS {
    int id PK
    int user_id FK
    int product_id FK
    int rating
    text comment
    timestamp created_at
  }

  WISHLIST {
    int id PK
    int user_id FK
    int product_id FK
    timestamp created_at
  }

  COUPONS {
    int id PK
    varchar code UK
    decimal discount_percent
    boolean active
    timestamp expires_at
  }
```

## Relationship Notes

- `users.email` and `users.phone` are unique.
- `products.category_id` references `categories.id`.
- `cart` enforces one cart row per user/product pair.
- `reviews` enforces one review per user/product pair.
- `wishlist` enforces one wishlist row per user/product pair.
- `orders.shipping_address_id` and `orders.billing_address_id` both reference `user_addresses.id`.
- `order_items` and `payment_records` cascade when an order is deleted.
- `coupons` are independent lookup records applied during checkout by `coupon_code`.
