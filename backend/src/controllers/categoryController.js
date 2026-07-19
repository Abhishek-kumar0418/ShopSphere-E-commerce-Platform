import { query } from "../config/db.js";
import { AppError } from "../utils/errors.js";

export async function listCategories(req, res, next) {
  try {
    const { rows } = await query("SELECT * FROM categories ORDER BY category_name");
    res.json({ categories: rows });
  } catch (error) {
    next(error);
  }
}

export async function createCategory(req, res, next) {
  try {
    const created = await query("INSERT INTO categories (category_name) VALUES ($1)", [req.body.category_name]);
    const { rows } = await query("SELECT * FROM categories WHERE id = $1", [created.rows.insertId]);
    res.status(201).json({ category: rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function updateCategory(req, res, next) {
  try {
    await query("UPDATE categories SET category_name = $1 WHERE id = $2", [req.body.category_name, req.params.id]);
    const { rows } = await query("SELECT * FROM categories WHERE id = $1", [req.params.id]);
    if (!rows[0]) throw new AppError("Category not found", 404);
    res.json({ category: rows[0] });
  } catch (error) {
    next(error);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    await query("DELETE FROM categories WHERE id = $1", [req.params.id]);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
