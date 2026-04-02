import express from "express";
import { getPaymentStats, getAllSubscriptions } from "../controllers/admin.js";
import { verifyAdmin } from "../middlewares/admin.js";

const router = express.Router();

// All admin routes require admin key
router.use(verifyAdmin);

// Payment management
router.get("/payments/stats", getPaymentStats);
router.get("/subscriptions/all", getAllSubscriptions);

export default router;
