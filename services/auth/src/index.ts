import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { sql } from "./utils/db.js";
import { createClient } from "redis";

export const redisClient = createClient({
	url: process.env.REDIS_URL,
	socket: {
		reconnectStrategy: (retries) => {
			if (retries > 10) {
				console.error("❌ Max Redis reconnection attempts reached");
				return new Error("Max reconnection retries exceeded");
			}
			return Math.min(retries * 50, 500);
		},
	},
});

// Add error handlers
redisClient.on("error", (err) => {
	console.error("❌ Redis Error:", err.message);
	// Don't crash the app, just log the error
});

redisClient.on("connect", () => {
	console.log("✅ Connected to Redis");
});

redisClient.on("reconnecting", () => {
	console.log("🔄 Attempting to reconnect to Redis...");
});

redisClient.connect().catch((err) => {
	console.error("❌ Failed to connect to Redis:", err.message);
	// Don't exit, app should still work without Redis for now
});

async function initDb() {
	try {
		await sql`
        DO $$
        BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
                CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');
            END IF;
        END$$;
        `;
		await sql`
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            phone_number VARCHAR(20) NOT NULL,
            role user_role NOT NULL,
            bio TEXT,
            resume VARCHAR(255),
            resume_public_id VARCHAR(255),
            profile_pic VARCHAR(255),
            profile_pic_public_id VARCHAR(255),
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            subscription TIMESTAMPTZ
        );
        `;

		await sql`
        CREATE TABLE IF NOT EXISTS skills (
            skill_id SERIAL PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL
        );
        `;

		await sql`
        CREATE TABLE IF NOT EXISTS user_skills (
            user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            skill_id INTEGER NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
            PRIMARY KEY (user_id, skill_id)
        );
        `;
		console.log("✅ Database initialized successfully");
	} catch (error) {
		console.log("❌ Error initializing database:", error);
		process.exit(1);
	}
}

initDb().then(() => {
	app.listen(process.env.PORT, () => {
		console.log(`Auth service is running on http://localhost:${process.env.PORT}`);
	});
});
