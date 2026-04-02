import express from "express";
import dotenv from "dotenv";
import Razorpay from "razorpay";
import cors from "cors";
import paymentRoutes from "./routes/payment.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

export const instance = new Razorpay({
    key_id: process.env.Razorpay_Key,
    key_secret: process.env.Razorpay_Secret,
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);
// Global error handler
app.use((err: any, req: any, res: any, next: any) => {
    console.error("❌ Error:", err);
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
    });
});
app.listen(process.env.PORT, () => {
    console.log(
        `✅ Payment Service is running on http://localhost:${process.env.PORT}`,
    );
});
