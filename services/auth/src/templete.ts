export const forgotPasswordTemplate = (resetLink: string) => {
	return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
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

            .button-wrapper {
                margin: 30px 0;
                text-align: center;
            }

            .button {
                display: inline-block;
                padding: 14px 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                font-size: 16px;
                box-shadow: 0 4px 6px rgba(102, 126, 234, 0.4);
            }

            .link-box {
                margin: 0 0 20px;
                padding: 15px;
                background-color: #f8f9fa;
                border-left: 4px solid #667eea;
                color: #667eea;
                font-size: 14px;

                word-break: break-all;
                border-radius: 4px;
            }

            .warning {
                margin: 20px 0;
                color: #666666;
                font-size: 14px;
                line-height: 1.6;
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
                <td align="center" style="padding: 40px 0;">
                    <table role="presentation" class="email-container">
                        <!-- Header -->
                        <tr>
                            <td class="header">
                                <h1>Reset Your Password</h1>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td class="content">
                                <p class="text">Hi there,</p>
                                <p class="text">
                                    We received a request to reset your password. Click the
                                    button below to create a new password:
                                </p>
                                <!-- Button -->
                                <div class="button-wrapper">
                                    <a href="${resetLink}" class="button">Reset Password</a>
                                </div>
                                <p class="text-muted">
                                    Or copy and paste this link into your browser:
                                </p>

                                <p class="link-box">${resetLink}</p>
                                <p class="warning">
                                    <strong>⏰ This link will expire in 15 minutes</strong>
                                    for security reasons.
                                </p>
                                <p class="text-muted">
                                    If you didn't request a password reset, please ignore this
                                    email or contact support if you have concerns.
                                </p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td class="footer">
                                <p class="footer-text">
                                    © 2026 Hireheaven. All rights reserved.
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

export const welcomeTemplate = (name: string) => {
	return `
    <!DOCTYPE html>
    <html lang="en">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to HireHeaven</title>
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
                color: #666666;
                font-size: 14px;
            }

            .button-wrapper {
                text-align: center;
                margin: 30px 0;
            }

            .button {
                display: inline-block;
                padding: 12px 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-decoration: none;
                border-radius: 6px;
                font-weight: 600;
                font-size: 16px;
            }

            .button:hover {
                opacity: 0.9;
            }

            .highlight {
                background-color: #f0f0f0;
                padding: 20px;
                border-left: 4px solid #667eea;
                margin: 20px 0;
                border-radius: 4px;
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
                <td align="center" style="padding: 40px 0;">
                    <table role="presentation" class="email-container">
                        <!-- Header -->
                        <tr>
                            <td class="header">
                                <h1>Welcome to HireHeaven!</h1>
                            </td>
                        </tr>
                        <!-- Content -->
                        <tr>
                            <td class="content">
                                <p class="text">Hi ${name},</p>
                                <p class="text">
                                    Welcome to HireHeaven! We're excited to have you on board.
                                </p>
                                
                                <div class="highlight">
                                    <p class="text"><strong>Your account is ready!</strong></p>
                                    <p class="text-muted">
                                        You can now log in and start exploring opportunities or posting jobs.
                                    </p>
                                </div>

                                <p class="text">
                                    Here's what you can do next:
                                </p>
                                <ul style="color: #333333; font-size: 16px; line-height: 1.8;">
                                    <li>Complete your profile to get noticed</li>
                                    <li>Browse job opportunities</li>
                                    <li>Post jobs (if you're a recruiter)</li>
                                    <li>Connect with top talent</li>
                                </ul>

                                <div class="button-wrapper">
                                    <a href="${process.env.FRONTEND_URL}" class="button">Get Started</a>
                                </div>

                                <p class="text-muted">
                                    If you have any questions or need assistance, feel free to reach out to our support team.
                                </p>
                            </td>
                        </tr>
                        <!-- Footer -->
                        <tr>
                            <td class="footer">
                                <p class="footer-text">
                                    © 2026 Hireheaven. All rights reserved.
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

export const loginAlertTemplate = (name: string, loginTime: string) => {
	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login Alert - HireHeaven</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
            }
            .email-container {
                width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px;
                text-align: center;
                color: white;
            }
            .content {
                padding: 30px;
            }
            .alert-box {
                background-color: #e8f5e9;
                border-left: 4px solid #4caf50;
                padding: 20px;
                margin: 20px 0;
                border-radius: 4px;
            }
            .text {
                color: #333;
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 15px;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e9ecef;
                font-size: 12px;
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>✓ Login Successful</h1>
            </div>
            <div class="content">
                <p class="text">Hi ${name},</p>
                <p class="text">Your account was just accessed at:</p>
                <div class="alert-box">
                    <p class="text"><strong>${loginTime}</strong></p>
                </div>
                <p class="text">If this wasn't you, please change your password immediately.</p>
                <p class="text-muted">Best regards,<br>HireHeaven Team</p>
            </div>
            <div class="footer">
                <p>© 2026 Hireheaven. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;
};

export const subscriptionInvoiceTemplate = (
	name: string,
	plan: string,
	amount: number,
	expiryDate: string,
	invoiceId: string
) => {
	return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Subscription Invoice - HireHeaven</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
            }
            .email-container {
                width: 600px;
                margin: 40px auto;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px;
                text-align: center;
                color: white;
            }
            .content {
                padding: 30px;
            }
            .invoice-box {
                background-color: #f9f9f9;
                border: 1px solid #ddd;
                padding: 20px;
                border-radius: 4px;
                margin: 20px 0;
            }
            .invoice-row {
                display: flex;
                justify-content: space-between;
                padding: 10px 0;
                border-bottom: 1px solid #eee;
            }
            .invoice-row.total {
                font-weight: bold;
                font-size: 18px;
                border: none;
                background-color: #f0f0f0;
                padding: 15px;
                margin-top: 10px;
                border-radius: 4px;
            }
            .text {
                color: #333;
                font-size: 16px;
                line-height: 1.6;
                margin: 0 0 15px;
            }
            .footer {
                background-color: #f8f9fa;
                padding: 20px;
                text-align: center;
                border-top: 1px solid #e9ecef;
                font-size: 12px;
                color: #999;
            }
            .success-badge {
                display: inline-block;
                background-color: #4caf50;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                font-weight: bold;
                margin: 10px 0;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>✓ Subscription Activated</h1>
            </div>
            <div class="content">
                <p class="text">Hi ${name},</p>
                <p class="text">Thank you for subscribing to HireHeaven Premium!</p>
                
                <div class="success-badge">Subscription Active</div>

                <div class="invoice-box">
                    <div class="invoice-row">
                        <span><strong>Invoice ID:</strong></span>
                        <span>${invoiceId}</span>
                    </div>
                    <div class="invoice-row">
                        <span><strong>Plan:</strong></span>
                        <span>${plan}</span>
                    </div>
                    <div class="invoice-row">
                        <span><strong>Amount:</strong></span>
                        <span>₹${amount.toLocaleString()}</span>
                    </div>
                    <div class="invoice-row">
                        <span><strong>Valid Until:</strong></span>
                        <span>${expiryDate}</span>
                    </div>
                    <div class="invoice-row total">
                        <span>Total Amount</span>
                        <span>₹${amount.toLocaleString()}</span>
                    </div>
                </div>

                <p class="text">
                    <strong>Benefits of your subscription:</strong>
                </p>
                <ul style="color: #333; font-size: 14px; line-height: 1.8;">
                    <li>Unlimited job postings</li>
                    <li>Priority candidate matching</li>
                    <li>Advanced analytics</li>
                    <li>24/7 Support</li>
                </ul>

                <p class="text">
                    If you have any questions, <strong>contact our support team</strong>.
                </p>
            </div>
            <div class="footer">
                <p>© 2026 Hireheaven. All rights reserved.</p>
                <p>This is an automated message, please do not reply.</p>
            </div>
        </div>
    </body>
    </html>
`;
};
