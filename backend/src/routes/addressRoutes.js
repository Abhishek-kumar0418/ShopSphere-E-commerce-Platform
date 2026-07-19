import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import { validate, schemas } from "../middleware/validate.js";
import { createAddress, listAddresses } from "../controllers/addressController.js";

export const addressRoutes = Router();
addressRoutes.use(authenticate);
addressRoutes.get("/", listAddresses);
addressRoutes.post("/", validate(schemas.address), createAddress);
