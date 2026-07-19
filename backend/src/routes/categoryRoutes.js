import { Router } from "express";
import { authenticate, authorize } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validate.js";
import { createCategory, deleteCategory, listCategories, updateCategory } from "../controllers/categoryController.js";

export const categoryRoutes = Router();
categoryRoutes.get("/", listCategories);
categoryRoutes.post("/", authenticate, authorize("admin"), validate(schemas.category), createCategory);
categoryRoutes.put("/:id", authenticate, authorize("admin"), validate(schemas.category), updateCategory);
categoryRoutes.delete("/:id", authenticate, authorize("admin"), deleteCategory);
