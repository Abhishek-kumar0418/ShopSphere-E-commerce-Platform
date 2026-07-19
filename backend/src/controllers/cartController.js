import { query } from "../config/db.js";
import { AppError } from "../utils/errors.js";

export async function getCart(req, res, next) {
  try {
    const { rows } = await query(
      `SELECT c.id, c.quantity, p.id AS product_id, p.name, p.image, p.price, p.discount_percent, (c.quantity * p.price * (1 - p.discount_percent / 100.0)) AS subtotal
       FROM cart c JOIN products p ON p.id = c.product_id WHERE c.user_id = $1 ORDER BY c.id DESC`,
      [req.user.id]
    );
    const total = rows.reduce((sum, item) => sum + Number(item.subtotal), 0);
    const tax = total * Number(process.env.TAX_RATE || 0.18);
    const shipping = total > 0 ? Number(process.env.SHIPPING_FLAT || 49) : 0;
    res.json({ items: rows, totals: { total, tax, shipping, grand_total: total + tax + shipping } });
  } catch (error) {
    next(error);
  }
}

export async function addToCart(req, res, next) {
  try {
    const { product_id, quantity } = req.body;
    const product = await query("SELECT stock FROM products WHERE id = $1", [product_id]);
    if (!product.rows[0]) throw new AppError("Product not found", 404);
    if (product.rows[0].stock < quantity) throw new AppError("Insufficient stock", 409);
    await query(
      `INSERT INTO cart (user_id, product_id, quantity) VALUES ($1,$2,$3)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.user.id, product_id, quantity]
    );
    res.status(201).json({ message: "Added to cart" });
  } catch (error) {
    next(error);
  }
}

export async function updateCart(req, res, next) {
  try {
    const { product_id, quantity } = req.body;
    await query("UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3", [quantity, req.user.id, product_id]);
    res.json({ message: "Cart updated" });
  } catch (error) {
    next(error);
  }
}

export async function removeFromCart(req, res, next) {
  try {
    await query("DELETE FROM cart WHERE user_id = $1 AND product_id = $2", [req.user.id, req.body.product_id || req.query.product_id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
