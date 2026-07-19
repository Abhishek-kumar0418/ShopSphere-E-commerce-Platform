import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { authRoutes } from "./routes/authRoutes.js";
import { productRoutes } from "./routes/productRoutes.js";
import { cartRoutes } from "./routes/cartRoutes.js";
import { orderRoutes } from "./routes/orderRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { categoryRoutes } from "./routes/categoryRoutes.js";
import { addressRoutes } from "./routes/addressRoutes.js";
import { errorHandler, notFound } from "./utils/errors.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, "..", "..", "frontend");

const app = express();
const port = process.env.PORT || 4000;

app.use(helmet());
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: process.env.FRONTEND_ORIGIN?.split(",") || true, credentials: true }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

// Serve static files from frontend folder
app.use(express.static(frontendPath));

// Root route
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Commerce API listening on http://localhost:${port}`);
});
