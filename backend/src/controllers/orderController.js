import { query, transaction } from "../config/db.js";
import { AppError } from "../utils/errors.js";

export async function createOrder(req, res, next) {
  try {
    const result = await transaction(async (client) => {
      const cart = await client.query(
        `SELECT c.product_id, c.quantity, p.price, p.stock, p.discount_percent FROM cart c JOIN products p ON p.id = c.product_id WHERE c.user_id = $1 FOR UPDATE`,
        [req.user.id]
      );
      if (!cart.rows.length) throw new AppError("Cart is empty", 400);
      for (const item of cart.rows) if (item.stock < item.quantity) throw new AppError(`Insufficient stock for product ${item.product_id}`, 409);
      const coupon = req.body.coupon_code ? await client.query("SELECT * FROM coupons WHERE code = $1 AND active = true", [req.body.coupon_code]) : { rows: [] };
      const subtotal = cart.rows.reduce((sum, item) => sum + Number(item.price) * item.quantity * (1 - item.discount_percent / 100), 0);
      const discount = coupon.rows[0] ? subtotal * (Number(coupon.rows[0].discount_percent) / 100) : 0;
      const tax = (subtotal - discount) * Number(process.env.TAX_RATE || 0.18);
      const shipping = Number(process.env.SHIPPING_FLAT || 49);
      const total = subtotal - discount + tax + shipping;
      const order = await client.query(
        "INSERT INTO orders (user_id, total_amount, tax_amount, shipping_amount, discount_amount, status, shipping_address_id, billing_address_id) VALUES ($1,$2,$3,$4,$5,'Pending',$6,$7)",
        [req.user.id, total, tax, shipping, discount, req.body.shipping_address_id, req.body.billing_address_id]
      );
      const orderId = order.rows.insertId;
      for (const item of cart.rows) {
        await client.query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1,$2,$3,$4)", [orderId, item.product_id, item.quantity, item.price]);
        await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [item.quantity, item.product_id]);
      }
      await client.query("INSERT INTO payment_records (order_id, amount, payment_method, status) VALUES ($1,$2,$3,$4)", [orderId, total, req.body.payment_method, req.body.payment_method === "cod" ? "Pending" : "Authorized"]);
      await client.query("DELETE FROM cart WHERE user_id = $1", [req.user.id]);
      const createdOrder = await client.query("SELECT * FROM orders WHERE id = $1", [orderId]);
      return createdOrder.rows[0];
    });
    res.status(201).json({ order: result, message: "Order placed. Notification email queued." });
  } catch (error) {
    next(error);
  }
}

export async function listOrders(req, res, next) {
  try {
    const admin = req.user.role === "admin";
    const { rows } = await query(`SELECT * FROM orders ${admin ? "" : "WHERE user_id = $1"} ORDER BY order_date DESC`, admin ? [] : [req.user.id]);
    res.json({ orders: rows });
  } catch (error) {
    next(error);
  }
}

export async function getOrder(req, res, next) {
  try {
    const { rows } = await query("SELECT * FROM orders WHERE id = $1 AND ($2 OR user_id = $3)", [req.params.id, req.user.role === "admin", req.user.id]);
    if (!rows[0]) throw new AppError("Order not found", 404);
    const items = await query("SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = $1", [req.params.id]);
    res.json({ order: rows[0], items: items.rows });
  } catch (error) {
    next(error);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const statuses = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!statuses.includes(req.body.status)) throw new AppError("Invalid status", 422);
    await query("UPDATE orders SET status = $1 WHERE id = $2", [req.body.status, req.body.order_id]);
    const { rows } = await query("SELECT * FROM orders WHERE id = $1", [req.body.order_id]);
    res.json({ order: rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function downloadInvoice(req, res, next) {
  try {
    const { rows } = await query("SELECT o.*, u.full_name, u.email FROM orders o JOIN users u ON u.id = o.user_id WHERE o.id = $1 AND ($2 OR o.user_id = $3)", [req.params.id, req.user.role === "admin", req.user.id]);
    if (!rows[0]) throw new AppError("Order not found", 404);
    const items = await query("SELECT oi.*, p.name FROM order_items oi JOIN products p ON p.id = oi.product_id WHERE oi.order_id = $1", [req.params.id]);
    const body = [
      `Invoice #${rows[0].id}`,
      `Customer: ${rows[0].full_name} (${rows[0].email})`,
      `Status: ${rows[0].status}`,
      `Date: ${new Date(rows[0].order_date).toISOString()}`,
      "",
      ...items.rows.map(item => `${item.name} x ${item.quantity} - ${item.price}`),
      "",
      `Tax: ${rows[0].tax_amount}`,
      `Shipping: ${rows[0].shipping_amount}`,
      `Discount: ${rows[0].discount_amount}`,
      `Total: ${rows[0].total_amount}`
    ].join("\n");
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${rows[0].id}.txt`);
    res.send(body);
  } catch (error) {
    next(error);
  }
}
