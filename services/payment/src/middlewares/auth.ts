import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";

interface User {
	user_id: number;
	name: string;
	email: string;
	phone_number: string;
	role: "jobseeker" | "recruiter";
	bio: string | null;
	resume: string | null;
	resume_public_id: string | null;
	profile_pic: string | null;
	profile_pic_public_id: string | null;
	skills: string[];
	subscription: string | null;
}

export interface AuthenticatedRequest extends Request {
	user?: User;
}

export const isAuth = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			res.status(401).json({
				message: "Authorization header is missing or invalid",
			});
			return;
		}

		const token = authHeader.split(" ")[1];

		const decodedPayload = jwt.verify(
			token,
			process.env.JWT_SEC as string,
		) as JwtPayload;

		if (!decodedPayload || !decodedPayload.id) {
			res.status(401).json({
				message: "Invalid Token",
			});
			return;
		}

		// Fetch user data from User Service instead of local database
		const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:5002";
		const userResponse = await axios.get(`${userServiceUrl}/api/user/me`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});

		const user = userResponse.data as User;
		user.skills = user.skills || [];

		req.user = user;
		next();
	} catch (error) {
		const errorMsg = error instanceof Error ? error.message : "Unknown error";
		console.error("[Auth] Token validation failed:", errorMsg);
		res.status(401).json({
			message: "Authentication Failed. Please login again",
		});
	}
};
