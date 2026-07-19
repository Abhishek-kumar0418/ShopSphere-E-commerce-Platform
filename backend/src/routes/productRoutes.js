import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validate.js";
import { createProduct, deleteProduct, getProduct, listProducts, updateProduct } from "../controllers/productController.js";

export const productRoutes = Router();
productRoutes.get("/", listProducts);
productRoutes.get("/:id", getProduct);
productRoutes.post("/", authenticate, authorize("admin"), validate(schemas.product), createProduct);
productRoutes.put("/:id", authenticate, authorize("admin"), validate(schemas.product), updateProduct);
productRoutes.delete("/:id", authenticate, authorize("admin"), deleteProduct);
