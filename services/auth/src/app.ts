import express from "express";
import authRoutes from "./routes/auth.js";
import { connectKafka } from "./producer.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Bull Queue for async email processing (non-blocking)
// Queue will be ready by the time requests come in
connectKafka().catch((error) => {
	console.error("❌ Failed to initialize Bull Queue:", error);
});

app.use("/api/auth", authRoutes);

export default app;