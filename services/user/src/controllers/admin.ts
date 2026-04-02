import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";

// Get all users with pagination
export const getAllUsers = TryCatch(async (req, res, next) => {
    const { page = 1, limit = 10, role, search } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let users;
    if (role && search) {
        const searchTerm = `%${search}%`;
        users = await sql`
            SELECT 
                user_id, 
                name, 
                email, 
                phone_number, 
                role, 
                subscription,
                created_at
            FROM users
            WHERE role = ${role} AND (name ILIKE ${searchTerm} OR email ILIKE ${searchTerm})
            ORDER BY created_at DESC
            LIMIT ${Number(limit)} OFFSET ${offset}
        `;
    } else if (role) {
        users = await sql`
            SELECT 
                user_id, 
                name, 
                email, 
                phone_number, 
                role, 
                subscription,
                created_at
            FROM users
            WHERE role = ${role}
            ORDER BY created_at DESC
            LIMIT ${Number(limit)} OFFSET ${offset}
        `;
    } else if (search) {
        const searchTerm = `%${search}%`;
        users = await sql`
            SELECT 
                user_id, 
                name, 
                email, 
                phone_number, 
                role, 
                subscription,
                created_at
            FROM users
            WHERE name ILIKE ${searchTerm} OR email ILIKE ${searchTerm}
            ORDER BY created_at DESC
            LIMIT ${Number(limit)} OFFSET ${offset}
        `;
    } else {
        users = await sql`
            SELECT 
                user_id, 
                name, 
                email, 
                phone_number, 
                role, 
                subscription,
                created_at
            FROM users
            ORDER BY created_at DESC
            LIMIT ${Number(limit)} OFFSET ${offset}
        `;
    }

    // Get total count
    let countResult;
    if (role && search) {
        const searchTerm = `%${search}%`;
        countResult =
            await sql`SELECT COUNT(*) as total FROM users WHERE role = ${role} AND (name ILIKE ${searchTerm} OR email ILIKE ${searchTerm})`;
    } else if (role) {
        countResult =
            await sql`SELECT COUNT(*) as total FROM users WHERE role = ${role}`;
    } else if (search) {
        const searchTerm = `%${search}%`;
        countResult =
            await sql`SELECT COUNT(*) as total FROM users WHERE name ILIKE ${searchTerm} OR email ILIKE ${searchTerm}`;
    } else {
        countResult = await sql`SELECT COUNT(*) as total FROM users`;
    }
    const total = countResult[0].total;

    res.json({
        users,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            pages: Math.ceil(total / Number(limit)),
        },
    });
});

// Get user by ID
export const getUserById = TryCatch(async (req, res, next) => {
    const { userId } = req.params;

    const users = await sql`
        SELECT 
            user_id, 
            name, 
            email, 
            phone_number, 
            role,
            bio,
            profile_pic,
            subscription,
            created_at
        FROM users 
        WHERE user_id = ${userId}
    `;

    if (users.length === 0) {
        throw new ErrorHandler(404, "User not found");
    }

    res.json(users[0]);
});

// Delete user
export const deleteUser = TryCatch(async (req, res, next) => {
    const { userId } = req.params;

    const user = await sql`SELECT user_id FROM users WHERE user_id = ${userId}`;

    if (user.length === 0) {
        throw new ErrorHandler(404, "User not found");
    }

    // Delete user skills first (foreign key)
    await sql`DELETE FROM user_skills WHERE user_id = ${userId}`;

    // Delete user
    await sql`DELETE FROM users WHERE user_id = ${userId}`;

    res.json({
        message: "User deleted successfully",
        userId,
    });
});

// Update user
export const updateUserAdmin = TryCatch(async (req, res, next) => {
    const { userId } = req.params;
    const { name, email, phone_number, subscription } = req.body;

    const user = await sql`SELECT user_id FROM users WHERE user_id = ${userId}`;

    if (user.length === 0) {
        throw new ErrorHandler(404, "User not found");
    }

    const updated = await sql`
        UPDATE users 
        SET 
            name = COALESCE(${name || null}, name),
            email = COALESCE(${email || null}, email),
            phone_number = COALESCE(${phone_number || null}, phone_number),
            subscription = COALESCE(${subscription || null}, subscription)
        WHERE user_id = ${userId}
        RETURNING user_id, name, email, phone_number, role, subscription
    `;

    res.json({
        message: "User updated successfully",
        user: updated[0],
    });
});

// Get user statistics
export const getUserStats = TryCatch(async (req, res, next) => {
    const totalUsers = await sql`SELECT COUNT(*) as count FROM users`;
    const recruiterCount = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'recruiter'`;
    const jobseekerCount = await sql`SELECT COUNT(*) as count FROM users WHERE role = 'jobseeker'`;
    const subscribedUsers = await sql`SELECT COUNT(*) as count FROM users WHERE subscription IS NOT NULL AND subscription > NOW()`;

    return res.json({
        totalUsers: totalUsers[0]?.count || 0,
        recruiters: recruiterCount[0]?.count || 0,
        jobseekers: jobseekerCount[0]?.count || 0,
        subscribedUsers: subscribedUsers[0]?.count || 0,
    });
});

// Get users by role
export const getUsersByRole = TryCatch(async (req, res, next) => {
    const { role } = req.params;

    if (role !== "recruiter" && role !== "jobseeker") {
        throw new ErrorHandler(400, "Invalid role");
    }

    const users = await sql`
        SELECT 
            user_id, 
            name, 
            email, 
            phone_number,
            subscription,
            created_at
        FROM users 
        WHERE role = ${role}
        ORDER BY created_at DESC
    `;

    res.json({
        role,
        count: users.length,
        users,
    });
});
