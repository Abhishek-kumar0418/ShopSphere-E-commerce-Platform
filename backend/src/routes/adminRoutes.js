import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { salesStats, listUsers } from "../controllers/adminController.js";

export const adminRoutes = Router();
adminRoutes.use(authenticate, authorize("admin"));
adminRoutes.get("/stats", salesStats);
adminRoutes.get("/users", listUsers);
