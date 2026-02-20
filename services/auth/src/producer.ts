import { Producer, Admin, Kafka } from "kafkajs";
import dotenv from "dotenv";

dotenv.config();

let producer: Producer;
let admin: Admin;

export const connectKafka = async () => {
	try {
		const kafka = new Kafka({
			clientId: "auth-service",
			brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
		});

		admin = kafka.admin();
		await admin.connect();

		const topics = await admin.listTopics();

		if (!topics.includes("send-mail")) {
			await admin.createTopics({
				topics: [
					{
						topic: "send-mail",
						numPartitions: 1,
						replicationFactor: 1,
					},
				],
			});
			console.log("✅ 'send-mail' topic created");
		}
		await admin.disconnect();

		producer = kafka.producer();
		await producer.connect();
		console.log("✅ Kafka producer connected");
	} catch (error) {
		console.error("❌ Error connecting to Kafka:", error);
	}
};

export const publishToTopic = async (topic: string, message: any) => {
	if (!producer) {
		throw new Error("❌ Producer is not connected");
		return;
	}

	try {
		await producer.send({
			topic: topic,
			messages: [{ value: JSON.stringify(message) }],
		});
		console.log(`✅ Message published to topic "${topic}"`);
	} catch (error) {
		console.error("❌ Error publishing message to topic:", error);
	}
};

export const disconnectKafka = async () => {
	if (producer) {
		producer.disconnect();
	}
};