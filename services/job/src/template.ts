const getStatusMessage = (status: string): { title: string; message: string } => {
	const messages: { [key: string]: { title: string; message: string } } = {
		Submitted: {
			title: "Application Received",
			message:
				"Great news! Your application has been received and is now being reviewed by our recruitment team. We appreciate your interest and will get back to you soon with updates.",
		},
		Rejected: {
			title: "Application Update",
			message:
				"Thank you for your interest and time! While we were impressed with your application, we've decided to move forward with other candidates at this time. We encourage you to apply for future opportunities that match your profile.",
		},
		Hired: {
			title: "Congratulations! You're Hired!",
			message:
				"Exciting news! We are thrilled to inform you that you have been selected for this position. Congratulations on this achievement! Our team will be reaching out soon with next steps.",
		},
	};

	return (
		messages[status] || {
			title: "Application Status Update",
			message: "Your application status has been updated.",
		}
	);
};

export const applicationStatusUpdateTemplate = (jobTitle: string, status: string) => {
	const { title, message } = getStatusMessage(status);

	return `
	<!doctype html>
	<html lang="en">
		<head>
			<meta charset="UTF-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<title>Application Status Update</title>
			<style>
				body {
					margin: 0;
					padding: 0;
					font-family: Arial, sans-serif;
					background-color: #f4f4f4;
				}

				.email-wrapper {
					width: 100%;
					border-collapse: collapse;
				}
				.email-container {
					width: 600px;
					border-collapse: collapse;
					background-color: #ffffff;
					box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
					border-radius: 8px;
					overflow: hidden;
				}
				.header {
					background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
					padding: 40px 30px;
					text-align: center;
				}
				.header h1 {
					margin: 0;
					color: #ffffff;
					font-size: 28px;
					font-weight: 600;
				}
				.content {
					padding: 40px 30px;
				}
				.text {
					margin: 0 0 20px;
					color: #333333;
					font-size: 16px;
					line-height: 1.6;
				}
				.text-muted {
					margin: 0 0 20px;
					color: #666666;
					font-size: 14px;
					line-height: 1.6;
				}
				.status-badge {
					display: inline-block;
					padding: 8px 16px;
					background-color: #f0f0f0;
					border-radius: 4px;
					font-weight: bold;
					color: #333333;
					margin: 20px 0;
				}
				.cta-button {
					display: inline-block;
					padding: 12px 32px;
					background-color: #667eea;
					color: #ffffff;
					text-decoration: none;
					border-radius: 4px;
					font-weight: bold;
					margin: 20px 0;
				}
				.cta-button:hover {
					background-color: #764ba2;
				}
				.footer {
					background-color: #f8f9fa;
					padding: 30px;
					text-align: center;
					border-top: 1px solid #e9ecef;
				}
				.footer-text {
					margin: 0 0 10px;
					color: #999999;
					font-size: 12px;
				}
				.footer-text:last-child {
					margin: 0;
				}
			</style>
		</head>

		<body>
			<table role="presentation" class="email-wrapper">
				<tr>
					<td align="center" style="padding: 40px 0">
						<table role="presentation" class="email-container">
							<!-- Header -->
							<tr>
								<td class="header">
									<h1>${title}</h1>
								</td>
							</tr>
							<!-- Content -->
							<tr>
								<td class="content">
									<p class="text">Hi there,</p>
									<p class="text">${message}</p>
									<p class="text">
										Position: <strong>${jobTitle}</strong>
									</p>
									<div style="text-align: center;">
										<a href="${process.env.FRONTEND_URL || "https://hireheaven.com"}/applications" class="cta-button">Check Your Status</a>
									</div>
									<p class="text-muted">
										If the button above doesn't work, you can also visit HireHeaven dashboard and navigate to "My Applications" to view your application status.
									</p>
								</td>
							</tr>
							<!-- Footer -->
							<tr>
								<td class="footer">
									<p class="footer-text">
										© 2025 HireHeaven. All rights reserved.
									</p>
									<p class="footer-text">
										This is an automated message, please do not reply.
									</p>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</body>
	</html>

`;
};
