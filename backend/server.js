import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import productRoutes from "./routes/productRoutes.js";
import { sql } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(helmet()); // Security middleware
app.use(morgan("dev")); // Log the requests

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
