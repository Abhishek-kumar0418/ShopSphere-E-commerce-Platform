import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validate.js";
import { login, logout, profile, register, updateProfile } from "../controllers/authController.js";

export const authRoutes = Router();
authRoutes.post("/register", validate(schemas.register), register);
authRoutes.post("/login", validate(schemas.login), login);
authRoutes.post("/logout", logout);
authRoutes.get("/profile", authenticate, profile);
authRoutes.put("/profile", authenticate, updateProfile);
