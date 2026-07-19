import { query } from "../config/db.js";

export async function listAddresses(req, res, next) {
  try {
    const { rows } = await query("SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY created_at DESC", [req.user.id]);
    res.json({ addresses: rows });
  } catch (error) {
    next(error);
  }
}

export async function createAddress(req, res, next) {
  try {
    const a = req.body;
    const created = await query(
      "INSERT INTO user_addresses (user_id, label, line1, line2, city, state, postal_code, country) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)",
      [req.user.id, a.label, a.line1, a.line2, a.city, a.state, a.postal_code, a.country]
    );
    const { rows } = await query("SELECT * FROM user_addresses WHERE id = $1", [created.rows.insertId]);
    res.status(201).json({ address: rows[0] });
  } catch (error) {
    next(error);
  }
}
