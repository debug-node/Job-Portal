import axios from "axios";
import getBuffer from "../utils/buffer.js";
import { sql } from "../utils/db.js";
import ErrorHandler from "../utils/errorHandler.js";
import { TryCatch } from "../utils/TryCatch.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
	forgotPasswordTemplate,
	welcomeTemplate,
	loginAlertTemplate,
} from "../templete.js";
import { redisClient } from "../index.js";

// Send email via utils service (Nodemailer)
const sendEmail = async (to: string, subject: string, html: string) => {
	try {
		await axios.post(
			`${process.env.UPLOAD_SERVICE}/api/utils/send-email`,
			{ to, subject, html }
		);
		console.log(`✅ Email sent to ${to}`);
	} catch (error) {
		console.error(`⚠️ Failed to send email to ${to}:`, (error as Error).message);
	}
};

export const registerUser = TryCatch(async (req, res, next) => {
	const { name, email, password, phoneNumber, role, bio } = req.body;

	if (!name || !email || !password || !phoneNumber || !role) {
		throw new ErrorHandler(400, "All fields are required");
	}

	const existingUsers = await sql`SELECT user_id FROM users WHERE email = ${email}`;

	if (existingUsers.length > 0) {
		throw new ErrorHandler(409, "User with this email already exists");
	}

	const hashPassword = await bcrypt.hash(password, 10);

	let registeredUser;

	if (role === "recruiter") {
		const [user] =
			await sql`INSERT INTO users (name, email, password, phone_number, role) VALUES (${name}, ${email}, ${hashPassword}, ${phoneNumber}, ${role}) RETURNING user_id, name, email, phone_number, role, created_at`;

		registeredUser = user;
	} else if (role === "jobseeker") {
		const file = req.file;

		if (!file) {
			throw new ErrorHandler(400, "Resume file is required for jobseekers");
		}

		const fileBuffer = getBuffer(file);

		if (!fileBuffer || !fileBuffer.content) {
			throw new ErrorHandler(500, "Failed to process the resume file");
		}

		const { data } = await axios.post(
			`${process.env.UPLOAD_SERVICE}/api/utils/upload`,
			{ buffer: fileBuffer.content },
		);

		const [user] =
			await sql`INSERT INTO users (name, email, password, phone_number, role, bio, resume, resume_public_id) VALUES (${name}, ${email}, ${hashPassword}, ${phoneNumber}, ${role}, ${bio}, ${data.url}, ${data.public_id}) RETURNING user_id, name, email, phone_number, role,bio,resume, created_at`;

		registeredUser = user;
	}

	const token = jwt.sign(
		{ id: registeredUser?.user_id },
		process.env.JWT_SEC as string,
		{
			expiresIn: "15d",
		},
	);

	// Send welcome email via utils service
	await sendEmail(
		registeredUser?.email,
		"Welcome to HireHeaven - Account Created Successfully",
		welcomeTemplate(registeredUser?.name)
	);

	res.json({
		message: "User registered successfully",
		registeredUser,
		token,
	});
});

export const loginUser = TryCatch(async (req, res, next) => {
	const { email, password } = req.body;

	if (!email || !password) {
		throw new ErrorHandler(400, "Please fill all details");
	}

	const user = await sql`
    SELECT u.user_id, u.name, u.email, u.password, u.phone_number, u.role, u.bio, u.resume, u.profile_pic, u.subscription, ARRAY_AGG(s.name) FILTER (WHERE s.name IS NOT NULL) as skills FROM users u LEFT JOIN user_skills us ON u.user_id = us.user_id LEFT JOIN skills s ON us.skill_id = s.skill_id WHERE u.email = ${email} GROUP BY u.user_id;
    `;

	if (user.length === 0) {
		throw new ErrorHandler(400, "Invalid credentials");
	}

	const userObject = user[0];

	const matchPassword = await bcrypt.compare(password, userObject.password);

	if (!matchPassword) {
		throw new ErrorHandler(400, "Invalid credentials");
	}

	userObject.skills = userObject.skills || [];

	delete userObject.password;

	const token = jwt.sign({ id: userObject?.user_id }, process.env.JWT_SEC as string, {
		expiresIn: "15d",
	});

	// Send login alert email via utils service
	const loginTime = new Date().toLocaleString();
	await sendEmail(
		userObject?.email,
		"Login Alert - HireHeaven",
		loginAlertTemplate(userObject?.name, loginTime)
	);

	res.json({
		message: "User logged in successfully",
		userObject,
		token,
	});
});

export const forgotPassword = TryCatch(async (req, res, next) => {
	const { email } = req.body;
	if (!email) {
		throw new ErrorHandler(400, "Email is required");
	}

	const users = await sql`SELECT user_id,email FROM users WHERE email = ${email}`;

	if (users.length === 0) {
		return res.json({
			message:
				"If a user with that email exists, a password reset link has been sent",
		});
	}
	const user = users[0];
	const resetToken = jwt.sign(
		{
			email: user.email,
			type: "reset",
		},
		process.env.JWT_SEC as string,
		{ expiresIn: "15m" },
	);

	const resetLink = `${process.env.FRONTEND_URL}/reset/${resetToken}`;

	// Only store in Redis if available (graceful degradation for production)
	if (process.env.REDIS_URL && redisClient) {
		try {
			await redisClient.set(`forgot:${email}`, resetToken, {
				EX: 900,
			});
		} catch (redisError) {
			console.warn("⚠️ Redis not available for password reset token storage", redisError);
		}
	}

	// Send reset email via utils service
	await sendEmail(
		email,
		"Reset Your Password - Hireheaven",
		forgotPasswordTemplate(resetLink)
	);

	res.json({
		message: "If a user with that email exists, a password reset link has been sent",
	});
});

export const resetPassword = TryCatch(async (req, res, next) => {
	const rawToken = req.params.token;
	const token = Array.isArray(rawToken) ? rawToken[0] : rawToken;
	const { password } = req.body;

	if (!token) {
		throw new ErrorHandler(400, "invalid token");
	}

	let decoded: any;

	try {
		decoded = jwt.verify(token, process.env.JWT_SEC as string);
	} catch (err) {
		throw new ErrorHandler(400, "expired token");
	}
	if (decoded.type !== "reset") {
		throw new ErrorHandler(400, "invalid token");
	}
	const email = decoded.email;
	
	// Check Redis if available (for production without Redis, JWT verification is enough)
	if (process.env.REDIS_URL && redisClient) {
		try {
			const storedToken = await redisClient.get(`forgot:${email}`);
			if (!storedToken || storedToken !== token) {
				throw new ErrorHandler(400, "invalid or expired token");
			}
		} catch (redisError) {
			console.warn("⚠️ Redis not available for token verification, using JWT only");
			// Proceed with JWT verification only (JWT has expiry check)
		}
	} else {
		// Production without Redis: JWT verification is sufficient (15m expiry)
		console.log("ℹ️ Using JWT-only password reset (no Redis)");
	}

	const users = await sql`SELECT user_id FROM users WHERE email = ${email}`;

	if (users.length === 0) {
		throw new ErrorHandler(404, "User not found");
	}

	const user = users[0];

	const hashPassword = await bcrypt.hash(password, 10);

	await sql`UPDATE users SET password = ${hashPassword} WHERE user_id = ${user.user_id}`;

	// Clean up Redis token if available
	if (process.env.REDIS_URL && redisClient) {
		try {
			await redisClient.del(`forgot:${email}`);
		} catch (redisError) {
			console.warn("⚠️ Failed to clean up Redis token", redisError);
		}
	}

	res.json({
		message: "Password has been reset successfully",
	});
});
