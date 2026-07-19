import { query } from "../config/db.js";

export async function salesStats(req, res, next) {
  try {
    const [sales, orders, users, products] = await Promise.all([
      query("SELECT COALESCE(SUM(total_amount),0) AS revenue FROM orders WHERE status <> 'Cancelled'"),
      query("SELECT status, COUNT(*) FROM orders GROUP BY status"),
      query("SELECT COUNT(*) AS users FROM users WHERE role = 'customer'"),
      query("SELECT COUNT(*) AS products, COALESCE(SUM(stock),0) AS stock FROM products")
    ]);
    res.json({ revenue: sales.rows[0].revenue, orders: orders.rows, users: users.rows[0].users, inventory: products.rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function listUsers(req, res, next) {
  try {
    const { rows } = await query("SELECT id, full_name, email, phone, role, created_at FROM users ORDER BY created_at DESC");
    res.json({ users: rows });
  } catch (error) {
    next(error);
  }
}
