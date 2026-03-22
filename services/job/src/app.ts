import express from "express";
import jobRoutes from "./routes/job.js";
import cors from "cors";
import { initEmailQueue } from "./producer.js";

const app = express();

app.use(cors());

app.use(express.json());

// Initialize Bull Queue for async email processing (non-blocking)
// Queue will be ready by the time requests come in
initEmailQueue().catch((error) => {
	console.error("❌ Failed to initialize Bull Queue:", error);
});

app.use("/api/job", jobRoutes);

export default app;
