import { TryCatch } from "../utils/TryCatch.js";
import { AuthenticatedRequest } from "../middlewares/auth.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sql } from "../utils/db.js";
import { instance } from "../index.js";
import axios from "axios";
import crypto from "crypto";
import { subscriptionInvoiceTemplate } from "../template.js";

// Send email via utils service (Nodemailer)
const sendEmail = async (to: string, subject: string, html: string) => {
	try {
		await axios.post(
			`${process.env.UPLOAD_SERVICE || "http://localhost:5001"}/api/utils/send-email`,
			{ to, subject, html }
		);
		console.log(`✅ Email sent to ${to}`);
	} catch (error) {
		console.error(`⚠️ Failed to send email to ${to}:`, (error as Error).message);
	}
};

export const checkOut = TryCatch(async (req: AuthenticatedRequest, res) => {
	if (!req.user) {
		throw new ErrorHandler(401, "No valid User");
	}

	const user = req.user;
	const user_id = user.user_id;

	const subTime = user?.subscription ? new Date(user.subscription).getTime() : 0;

	const now = Date.now();

	const isSubscribed = subTime > now;

	if (isSubscribed) {
		throw new ErrorHandler(400, "You already have a subscription");
	}

	const options = {
		amount: Number(process.env.RAZORPAY_AMOUNT || 119) * 100,
		currency: process.env.RAZORPAY_CURRENCY || "INR",
		notes: {
			user_id: user_id.toString(),
		},
	};

	const order = await instance.orders.create(options);

	res.status(201).json({
		order,
	});
});

export const paymentVerification = TryCatch(async (req: AuthenticatedRequest, res) => {
	const user = req.user;

	const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

	const body = razorpay_order_id + "|" + razorpay_payment_id;

	const expectedSignature = crypto
		.createHmac("sha256", process.env.Razorpay_Secret as string)
		.update(body)
		.digest("hex");

	const isAuthentic = expectedSignature === razorpay_signature;

	if (isAuthentic) {
		const now = new Date();

		const thirtyDays = 30 * 24 * 60 * 60 * 1000;

		const expiryDate = new Date(now.getTime() + thirtyDays);

		try {
			// Call User Service to update subscription
			const userServiceUrl = process.env.USER_SERVICE_URL || "http://localhost:5002";
			const userResponse = await axios.put(
				`${userServiceUrl}/api/admin/users/update/${user?.user_id}`,
				{ subscription: expiryDate },
				{
					headers: {
						"x-admin-key": process.env.ADMIN_SECRET_KEY,
					},
				}
			);

			const updatedUser = userResponse.data.user;

			// Send subscription invoice email via utils service
			const plan = "HireHeaven Premium - 1 Month";
			const amount = Number(process.env.RAZORPAY_AMOUNT || 119);
			const invoiceId = `INV-${razorpay_payment_id}`;
			const expiryDateStr = expiryDate.toLocaleDateString();

			await sendEmail(
				updatedUser?.email,
				"Subscription Confirmation and Invoice - HireHeaven",
				subscriptionInvoiceTemplate(updatedUser?.name, plan, amount, expiryDateStr, invoiceId)
			);

			res.json({
				message: "Subscription Purchased Successfully",
				updatedUser,
			});
		} catch (error) {
			console.error("Error updating subscription:", error);
			throw new ErrorHandler(500, "Failed to update subscription. Please try again.");
		}
	} else {
		return res.status(400).json({
			message: "Payment Failed",
		});
	}
});
