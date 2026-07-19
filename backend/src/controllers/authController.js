import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { AppError } from "../utils/errors.js";

function sign(user, remember = false) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: remember ? "30d" : process.env.JWT_EXPIRES_IN || "7d"
  });
}

export async function register(req, res, next) {
  try {
    const { full_name, email, phone, password } = req.body;
    const normalizedPhone = (phone || "").trim() || `phone-${Date.now().toString().slice(-8)}`;
    const exists = await query("SELECT id FROM users WHERE email = $1 OR phone = $2", [email.toLowerCase(), normalizedPhone]);
    if (exists.rows.length) throw new AppError("Email or phone already registered", 409);
    const password_hash = await bcrypt.hash(password, 12);
    const created = await query(
      "INSERT INTO users (full_name, email, phone, password_hash) VALUES ($1, $2, $3, $4)",
      [full_name, email.toLowerCase(), normalizedPhone, password_hash]
    );
    const { rows } = await query("SELECT id, full_name, email, phone, role FROM users WHERE id = $1", [created.rows.insertId]);
    res.status(201).json({ user: rows[0], token: sign(rows[0]) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password, remember_me } = req.body;
    const { rows } = await query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) throw new AppError("Invalid credentials", 401);
    const token = sign(user, remember_me);
    res.cookie("token", token, { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV === "production" });
    res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, phone: user.phone, role: user.role } });
  } catch (error) {
    next(error);
  }
}

export function logout(req, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
}

export async function profile(req, res) {
  res.json({ user: req.user });
}

export async function updateProfile(req, res, next) {
  try {
    const { full_name, phone } = req.body;
    await query(
      "UPDATE users SET full_name = COALESCE($1, full_name), phone = COALESCE($2, phone) WHERE id = $3",
      [full_name, phone, req.user.id]
    );
    const { rows } = await query("SELECT id, full_name, email, phone, role FROM users WHERE id = $1", [req.user.id]);
    res.json({ user: rows[0] });
  } catch (error) {
    next(error);
  }
}
