import express from "express";
import dotenv from "dotenv";
import jobRoutes from "./routes/job.js";
import adminRoutes from "./routes/admin.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/job", jobRoutes);
app.use("/api/admin", adminRoutes);

// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error("❌ Error:", err);
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});

export default app;
