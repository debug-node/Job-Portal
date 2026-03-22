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
            .header h1 {
                margin: 0;
                font-size: 28px;
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
                font-size: 14px;
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
            .success-badge {
                display: inline-block;
                background-color: #4caf50;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                font-weight: bold;
                margin: 10px 0;
            }
            .benefits {
                background-color: #e8f5e9;
                padding: 15px;
                border-radius: 4px;
                margin: 20px 0;
            }
            .benefits ul {
                margin: 10px 0;
                padding-left: 20px;
            }
            .benefits li {
                margin: 5px 0;
                color: #333;
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
                <h1>✓ Subscription Activated</h1>
            </div>
            <div class="content">
                <p class="text">Hi ${name},</p>
                <p class="text">Thank you for subscribing to HireHeaven Premium! Your subscription is now active.</p>
                
                <div class="success-badge">✓ Payment Successful</div>

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
                        <span><strong>Amount Paid:</strong></span>
                        <span>₹${amount.toLocaleString()}</span>
                    </div>
                    <div class="invoice-row">
                        <span><strong>Valid Until:</strong></span>
                        <span>${expiryDate}</span>
                    </div>
                    <div class="invoice-row total">
                        <span>Total</span>
                        <span>₹${amount.toLocaleString()}</span>
                    </div>
                </div>

                <div class="benefits">
                    <p><strong>Your Premium Benefits:</strong></p>
                    <ul>
                        <li>Unlimited job postings</li>
                        <li>Priority candidate matching</li>
                        <li>Advanced analytics & insights</li>
                        <li>Featured job listings</li>
                        <li>24/7 Priority support</li>
                    </ul>
                </div>

                <p class="text">
                    You can now access all premium features. If you have any questions or need support, please contact us.
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
