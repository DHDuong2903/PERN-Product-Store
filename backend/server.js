import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
// import userRoutes from "./routes/userRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";
import { aj } from "./libs/arcjet.js";
import path from "path";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();

app.use(cors());
app.use(express.json()); 
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
); // Security middleware
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
    if (decision.results.some((result) => result.reason.isBot() && result.reason.isSpoofed())) {
      res.status(403).json({ error: "Spoofed bots detected" });
      return;
    }
    next();
  } catch (error) {
    next(error);
  }
});

// app.use("/api/user", userRoutes);
// app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}
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
