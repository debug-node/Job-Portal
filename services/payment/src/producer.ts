import Queue from "bull";
import dotenv from "dotenv";

dotenv.config();

interface EmailMessage {
	to: string;
	subject: string;
	html: string;
}

let emailQueue: Queue.Queue;

export const initEmailQueue = async () => {
	try {
		emailQueue = new Queue("send-mail", process.env.REDIS_URL as string, {
			redis: {
				tls: { rejectUnauthorized: false },
				maxRetriesPerRequest: null,
				connectTimeout: 30000,
				commandTimeout: 30000,
				enableReadyCheck: false,
			},
		});

		console.log("✅ Email queue initialized in payment service");
	} catch (error) {
		console.error("❌ Error initializing email queue:", error);
	}
};

export const publishToTopic = async (message: EmailMessage) => {
	try {
		if (!emailQueue) {
			throw new Error("Email queue not initialized");
		}

		await emailQueue.add(message, {
			attempts: 3,
			backoff: {
				type: "exponential",
				delay: 2000,
			},
		});

		console.log(`📧 Email job queued for: ${message.to}`);
	} catch (error) {
		console.error("❌ Error publishing email message:", error);
		throw error;
	}
};
