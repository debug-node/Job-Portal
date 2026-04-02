import express from "express";
import {
    getAllUsers,
    getUserById,
    deleteUser,
    updateUserAdmin,
    getUserStats,
    getUsersByRole,
} from "../controllers/admin.js";
import { verifyAdmin } from "../middleware/admin.js";

const router = express.Router();

// All admin routes require admin key
router.use(verifyAdmin);

// User management
router.get("/users/all", getAllUsers);
router.get("/users/stats", getUserStats);
router.get("/users/role/:role", getUsersByRole);
router.get("/users/:userId", getUserById);
router.put("/users/update/:userId", updateUserAdmin);
router.delete("/users/delete/:userId", deleteUser);

export default router;
