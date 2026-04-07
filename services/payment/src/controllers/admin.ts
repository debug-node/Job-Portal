import axios from "axios";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";

// Get payment stats
export const getPaymentStats = TryCatch(async (req, res, next) => {
    try {
        // Fetch stats from User Service
        const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:5002";
        const statsResponse = await axios.get(`${userServiceUrl}/api/admin/users/stats`, {
            headers: {
                "x-admin-key": process.env.ADMIN_SECRET_KEY,
            },
        });

        const subscribedUsers = statsResponse.data.subscribedUsers || 0;
        const revenue = subscribedUsers * 119;

        res.json({
            totalSubscriptions: subscribedUsers,
            activeSubscriptions: subscribedUsers,
            cancelledSubscriptions: 0,
            totalRevenue: revenue,
        });
    } catch (error) {
        console.error("Error fetching payment stats:", error);
        throw new ErrorHandler(500, "Failed to fetch payment statistics");
    }
});

// Get all subscriptions
export const getAllSubscriptions = TryCatch(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    
    try {
        // Fetch all users from User Service
        const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:5002";
        const usersResponse = await axios.get(
            `${userServiceUrl}/api/admin/users/all?page=${page}&limit=${limit}`,
            {
                headers: {
                    "x-admin-key": process.env.ADMIN_SECRET_KEY,
                },
            }
        );

        const allUsers = usersResponse.data.users || [];
        const pagination = usersResponse.data.pagination || {};

        // Filter users with subscriptions
        const subscriptions = allUsers
            .filter((u: any) => u.subscription)
            .map((u: any) => ({
                user_id: u.user_id,
                user_name: u.name,
                email: u.email,
                plan_type: "Premium",
                amount: 119,
                status: new Date(u.subscription) > new Date() ? "active" : "cancelled",
                created_at: new Date(),
                expires_at: u.subscription,
            }));

        res.json({
            subscriptions,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: pagination.total,
                pages: pagination.pages,
            },
        });
    } catch (error) {
        console.error("Error fetching subscriptions:", error);
        throw new ErrorHandler(500, "Failed to fetch subscriptions");
    }
});
