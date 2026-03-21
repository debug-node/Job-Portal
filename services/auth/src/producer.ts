import Queue from "bull";
import dotenv from "dotenv";

dotenv.config();

interface EmailMessage {
	to: string;
	subject: string;
	html: string;
}

let emailQueue: Queue.Queue;

export const connectKafka = async () => {
	try {
		// Create queue with REDIS_URL and proper TLS options for Upstash
		emailQueue = new Queue("send-mail", process.env.REDIS_URL as string, {
			redis: {
				tls: { rejectUnauthorized: false },
				maxRetriesPerRequest: null,
				connectTimeout: 30000,
				commandTimeout: 30000,
				enableReadyCheck: false,
			},
		});

		emailQueue.on("error", (error: Error) => {
			// Suppress expected errors
			const silence = error.message.includes("max retries") || 
			              error.message.includes("Command timed out");
			if (!silence) {
				console.error("❌ Queue error:", error.message);
			}
		});

		emailQueue.on("active", ({ id }: { id: string | number }) => {
			console.log(`✅ Job ${id} is processing`);
		});

		console.log("✅ Bull Queue (send-mail) initialized");
	} catch (error) {
		console.error("❌ Error connecting to Bull Queue:", error);
	}
};

export const publishToTopic = async (message: EmailMessage): Promise<void> => {
	const maxRetries = 5;
	let lastError: Error | null = null;

	for (let i = 0; i < maxRetries; i++) {
		// Wait for queue to be initialized
		if (!emailQueue) {
			await new Promise((resolve) => setTimeout(resolve, 500));
			continue;
		}

		try {
			const job = await emailQueue.add(message, {
				attempts: 3,
				backoff: {
					type: "exponential",
					delay: 2000,
				},
			});
			console.log(`✅ Queued! Job ID: ${job.id}`);
			return;
		} catch (error) {
			lastError = error as Error;
			console.error(`   ⚠️  Attempt ${i + 1}/${maxRetries} failed: ${lastError.message}`);
			if (i < maxRetries - 1) {
				await new Promise((resolve) => setTimeout(resolve, 500));
			}
		}
	}

	throw new Error(`❌ Failed to queue email after ${maxRetries} attempts: ${lastError?.message}`);
};

export const disconnectKafka = async (): Promise<void> => {
	if (emailQueue) {
		await emailQueue.close();
	}
};
