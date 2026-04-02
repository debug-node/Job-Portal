import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";

// Get payment stats
export const getPaymentStats = TryCatch(async (req, res, next) => {
    const totalSubscriptions =
        await sql`SELECT COUNT(*) as count FROM users WHERE subscription IS NOT NULL`;
    const activeSubscriptions =
        await sql`SELECT COUNT(*) as count FROM users WHERE subscription IS NOT NULL AND subscription > NOW()`;
    const cancelledSubscriptions =
        await sql`SELECT COUNT(*) as count FROM users WHERE subscription IS NULL OR subscription <= NOW()`;

    // Get total revenue (approximation: 119 INR per active subscriber)
    const revenue = (activeSubscriptions[0].count || 0) * 119;

    res.json({
        totalSubscriptions: totalSubscriptions[0].count,
        activeSubscriptions: activeSubscriptions[0].count,
        cancelledSubscriptions: cancelledSubscriptions[0].count,
        totalRevenue: revenue,
    });
});

// Get all subscriptions
export const getAllSubscriptions = TryCatch(async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    const subscriptions = await sql`
        SELECT 
            u.user_id, u.name as user_name, u.email, 'Premium' as plan_type,
            119 as amount, 
            CASE WHEN u.subscription > NOW() THEN 'active' ELSE 'cancelled' END as status,
            NOW() as created_at, u.subscription as expires_at
        FROM users u
        WHERE u.subscription IS NOT NULL
        ORDER BY u.subscription DESC
        LIMIT ${Number(limit)} OFFSET ${offset}
    `;

    // Get total count
    const countResult =
        await sql`SELECT COUNT(*) as total FROM users WHERE subscription IS NOT NULL`;

    const total = countResult[0].total;

    res.json({
        subscriptions,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
        },
    });
});
