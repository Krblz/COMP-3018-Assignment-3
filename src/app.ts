import express, { Express } from "express";
import setupSwagger from "../config/swagger";
import dotenv from "dotenv";
import { apiHelmetConfig } from "../config/apiHelmetConfig";
import { getCorsOptions } from "../config/corsConfig";
import cors from "cors";

dotenv.config();

import eventRoutes from "./api/v1/routes/eventRoutes";

// Initialize Express application
const app: Express = express();

// Define a route
app.use(apiHelmetConfig);
app.use(cors(getCorsOptions())); 

app.use(express.json());
app.use("/api/v1", eventRoutes);

app.get("/api/v1/health", (req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

export default app;

setupSwagger(app);