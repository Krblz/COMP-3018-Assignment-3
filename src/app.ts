import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

import eventRoutes from "./api/v1/routes/eventRoutes";

// Initialize Express application
const app: Express = express();

// Define a route
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