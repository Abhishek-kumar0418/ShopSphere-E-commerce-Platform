import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validate.js";
import { addToCart, getCart, removeFromCart, updateCart } from "../controllers/cartController.js";

export const cartRoutes = Router();
cartRoutes.use(authenticate);
cartRoutes.get("/", getCart);
cartRoutes.post("/add", validate(schemas.cartItem), addToCart);
cartRoutes.put("/update", validate(schemas.cartItem), updateCart);
cartRoutes.delete("/remove", removeFromCart);
