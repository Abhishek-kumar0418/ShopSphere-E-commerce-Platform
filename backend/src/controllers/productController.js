import { query } from "../config/db.js";
import { AppError } from "../utils/errors.js";

export async function listProducts(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page || 1), 1);
    const limit = Math.min(Math.max(Number(req.query.limit || 12), 1), 50);
    const offset = (page - 1) * limit;
    const sortMap = { price_asc: "p.price ASC", price_desc: "p.price DESC", rating: "rating DESC", latest: "p.created_at DESC" };
    const sort = sortMap[req.query.sort] || "p.created_at DESC";
    const filters = [];
    const params = [];
    if (req.query.search) {
      params.push(`%${req.query.search}%`);
      filters.push(`(LOWER(p.name) LIKE LOWER($${params.length}) OR LOWER(p.description) LIKE LOWER($${params.length}))`);
    }
    if (req.query.category) {
      params.push(req.query.category);
      filters.push(`c.category_name = $${params.length}`);
    }
    if (req.query.min_price) {
      params.push(Number(req.query.min_price));
      filters.push(`p.price >= $${params.length}`);
    }
    if (req.query.max_price) {
      params.push(Number(req.query.max_price));
      filters.push(`p.price <= $${params.length}`);
    }
    const having = [];
    if (req.query.rating) {
      params.push(Number(req.query.rating));
      having.push(`COALESCE(rt.rating, 0) >= $${params.length}`);
    }
    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const ratingSql = having.length ? `AND ${having.join(" AND ")}` : "";
    params.push(limit, offset);
    const sql = `
      SELECT p.*, c.category_name, COALESCE(rt.rating, 0) AS rating, COALESCE(rt.review_count, 0) AS review_count
      FROM products p
      JOIN categories c ON c.id = p.category_id
      LEFT JOIN (SELECT product_id, ROUND(AVG(rating), 1) AS rating, COUNT(*) AS review_count FROM reviews GROUP BY product_id) rt ON rt.product_id = p.id
      ${where}
      ${where ? ratingSql : ratingSql.replace(/^AND/, "WHERE")}
      ORDER BY ${sort}
      LIMIT $${params.length - 1} OFFSET $${params.length}`;
    const { rows } = await query(sql, params);
    res.json({ page, limit, products: rows });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT p.*, c.category_name, COALESCE(rt.rating, 0) AS rating, COALESCE(rt.review_count, 0) AS review_count
       FROM products p JOIN categories c ON c.id = p.category_id
       LEFT JOIN (SELECT product_id, ROUND(AVG(rating), 1) AS rating, COUNT(*) AS review_count FROM reviews GROUP BY product_id) rt ON rt.product_id = p.id
       WHERE p.id = $1`,
      [req.params.id]
    );
    if (!rows[0]) throw new AppError("Product not found", 404);
    const reviews = await query("SELECT r.*, u.full_name FROM reviews r JOIN users u ON u.id = r.user_id WHERE product_id = $1 ORDER BY r.created_at DESC", [req.params.id]);
    const related = await query("SELECT id, name, price, image FROM products WHERE category_id = $1 AND id <> $2 LIMIT 4", [rows[0].category_id, req.params.id]);
    res.json({ product: rows[0], reviews: reviews.rows, related: related.rows });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  try {
    const p = req.body;
    const created = await query(
      `INSERT INTO products (name, description, specifications, price, discount_percent, stock, image, images, category_id, is_featured, is_best_seller)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [p.name, p.description, JSON.stringify(p.specifications), p.price, p.discount_percent, p.stock, p.image, JSON.stringify(p.images), p.category_id, p.is_featured, p.is_best_seller]
    );
    const { rows } = await query("SELECT * FROM products WHERE id = $1", [created.rows.insertId]);
    res.status(201).json({ product: rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const p = req.body;
    await query(
      `UPDATE products SET name=$1, description=$2, specifications=$3, price=$4, discount_percent=$5, stock=$6, image=$7, images=$8, category_id=$9, is_featured=$10, is_best_seller=$11
       WHERE id=$12`,
      [p.name, p.description, JSON.stringify(p.specifications), p.price, p.discount_percent, p.stock, p.image, JSON.stringify(p.images), p.category_id, p.is_featured, p.is_best_seller, req.params.id]
    );
    const { rows } = await query("SELECT * FROM products WHERE id = $1", [req.params.id]);
    if (!rows[0]) throw new AppError("Product not found", 404);
    res.json({ product: rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    await query("DELETE FROM products WHERE id = $1", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
