import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create Nodemailer transporter
const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

// Send email helper function
export const sendEmail = async (to: string, subject: string, html: string) => {
	try {
		const mailOptions = {
			from: process.env.EMAIL_USER,
			to,
			subject,
			html,
		};

		const result = await transporter.sendMail(mailOptions);
		console.log(`✅ Email sent to ${to} | MessageID: ${result.messageId}`);
		return { success: true, messageId: result.messageId };
	} catch (error) {
		console.error(`❌ Failed to send email to ${to}:`, (error as Error).message);
		throw error;
	}
};
