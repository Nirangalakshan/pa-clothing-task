import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOrderConfirmationEmail = async (email, order, username) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${
        item.size
      })</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${
        item.quantity
      }</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(
        2
      )}</td>
    </tr>
  `
    )
    .join("");

  const mailOptions = {
    from: `"PA Clothing" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Order Confirmation - #${order._id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background: #0f0f14; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">PA CLOTHING</h1>
          <p style="margin: 5px 0 0; opacity: 0.8;">Order Confirmation</p>
        </div>
        <div style="padding: 20px;">
          <p>Hello <strong>${username}</strong>,</p>
          <p>Thank you for your order! We've received your payment and are processing it.</p>
          
          <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
            <p style="margin: 0; font-size: 14px; color: #666;">Order ID:</p>
            <p style="margin: 5px 0 0; font-weight: bold;">#${order._id}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #eee;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 10px; text-align: right; font-weight: bold; color: #667eea;">$${order.totalPrice.toFixed(
                  2
                )}</td>
              </tr>
            </tfoot>
          </table>

        </div>
        <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #888;">
          <p>© 2026 PA Clothing. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};
