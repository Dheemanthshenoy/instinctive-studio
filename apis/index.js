import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import chalk from "chalk";

// Routes
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import { search } from "./controllers/products.js";

dotenv.config();

const connectionString = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

console.log(connectionString);

/**
 * @description Connect to MongoDB
 * @param {string} connectionString - The connection string for the MongoDB database
 * @returns {Promise<void>}
*/
mongoose.connect(connectionString).then(() => {
  console.log(chalk.green("✅ Connected to MongoDB"));
}).catch((_error) => {
  console.log(`Error connecting to MongoDB: ${_error}`);
});

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("B2B Marketplace API");
});

app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/search', search);

app.listen(PORT, () => {
  console.log(`${chalk.cyan("Server is running on port " + PORT)}`);
});