import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./libs/arcjet.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(helmet()); // Security middleware
app.use(morgan("dev")); // Log the requests

// Apply arcjet rate-limit to all routes

app.use(async (req, res, next) => {
  try {
    // Request được kiểm tra bởi arjet qua các rules
    const decision = await aj.protect(req, {
      requested: 1, // Mỗi request sẽ tốn 1 token
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too many Resquests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "Access denied for bots" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return;
    }

    // Check for spoofed bots (bot giả mạo)
    if (decision.results.some((result) => result.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: "Spoofed bots detected" });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
});

app.use("/api/products", productRoutes);

const initDB = async () => {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log("Database initialized successfully.");
  } catch (error) {
    console.log("Error initializing database:", error);
  }
};

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
