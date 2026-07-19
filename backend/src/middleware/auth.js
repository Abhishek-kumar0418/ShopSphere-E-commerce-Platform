import jwt from "jsonwebtoken";
import { query } from "../config/db.js";
import { AppError } from "../utils/errors.js";

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : req.cookies?.token;
    if (!token) throw new AppError("Authentication required", 401);

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { rows } = await query("SELECT id, full_name, email, phone, role FROM users WHERE id = $1", [payload.sub]);
    if (!rows[0]) throw new AppError("User no longer exists", 401);
    req.user = rows[0];
    next();
  } catch (error) {
    next(error.name === "JsonWebTokenError" ? new AppError("Invalid token", 401) : error);
  }
}

export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return next(new AppError("Forbidden", 403));
    next();
  };
}
