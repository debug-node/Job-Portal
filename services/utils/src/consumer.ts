import Queue from "bull";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

let emailQueue: Queue.Queue;

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY as string);

export const startSendMailConsumer = async () => {
	try {
		console.log("⏳ Initializing Bull Queue...");

		// Create queue with REDIS_URL and proper TLS options for Upstash
		emailQueue = new Queue("send-mail", process.env.REDIS_URL as string, {
			redis: {
				tls: { rejectUnauthorized: false },
				maxRetriesPerRequest: null,
				connectTimeout: 30000,
				commandTimeout: 30000,
				enableReadyCheck: false,
				// Add reconnection strategy
				retryStrategy: (times) => {
					const delay = Math.min(times * 50, 2000);
					return delay;
				},
			},
			defaultJobOptions: {
				attempts: 3,
				backoff: {
					type: "exponential",
					delay: 2000,
				},
				removeOnComplete: true,
				removeOnFail: false,
			},
		});

		// Set up event listeners immediately (non-blocking)
		(emailQueue as any).client.on("connect", () => {
			console.log("✅ Redis client connected");
		});

		(emailQueue as any).client.on("reconnecting", () => {
			console.log("🔄 Redis client reconnecting...");
		});

		(emailQueue as any).client.on("error", (error: Error) => {
			// Suppress expected errors that shouldn't spam logs
			const silence =
				error.message.includes("max retries") ||
				error.message.includes("Command timed out") ||
				error.message.includes("ECONNRESET") ||
				error.message.includes("Socket closed");
			if (!silence) {
				console.error("❌ Redis client error:", error.message);
			}
		});

		// Start processing jobs immediately (doesn't wait for connection)
		emailQueue.on("active", (job: Queue.Job) => {
			console.log(`📨 Job #${job.id} processing...`);
		});

		emailQueue.on("waiting", (jobId: string) => {
			// Silent
		});

		emailQueue.on("added", (job: Queue.Job) => {
			// Silent
		});

		emailQueue.process(5, async (job: Queue.Job) => {
			console.log(`📨 Processing job #${job.id}...`);

			try {
				const { to, subject, html } = job.data;

				if (!to || !subject || !html) {
					throw new Error(
						`Missing email data: to=${to}, subject=${subject}, html=${html}`,
					);
				}

				const msg = {
					to,
					from: "onboarding@resend.dev",
					subject,
					html,
				};

				const result = await resend.emails.send(msg);

				console.log(`✅ Email sent! ID: ${result?.data?.id || "sent"}`);
				return { success: true, id: result?.data?.id };
			} catch (error) {
				console.error(`❌ Email failed:`, (error as Error).message);
				throw error;
			}
		});

		emailQueue.on("failed", (job: Queue.Job, err: Error) => {
			console.error(`❌ Job ${job.id} failed after retries:`, err.message);
		});

		emailQueue.on("completed", (job: Queue.Job) => {
			console.log(`✅ Job ${job.id} completed successfully`);
		});

		emailQueue.on("error", (error: Error) => {
			// Don't spam logs with command timeout errors
			if (
				!error.message.includes("Command timed out") &&
				!error.message.includes("Socket closed")
			) {
				console.error("❌ Bull Queue error:", error.message);
			}
		});

		console.log("✅ Mail service started");
	} catch (error) {
		console.error("❌ Error in Bull Queue mail service consumer:", error);
		// Don't exit - let it try to recover
	}
};
