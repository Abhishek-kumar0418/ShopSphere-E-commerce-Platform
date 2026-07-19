import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validate.js";
import { createOrder, downloadInvoice, getOrder, listOrders, updateStatus } from "../controllers/orderController.js";

export const orderRoutes = Router();
orderRoutes.use(authenticate);
orderRoutes.post("/", validate(schemas.order), createOrder);
orderRoutes.get("/", listOrders);
orderRoutes.get("/:id", getOrder);
orderRoutes.get("/:id/invoice", downloadInvoice);
orderRoutes.put("/status", authorize("admin"), updateStatus);
