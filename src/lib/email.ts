import axios from "axios";

interface EmailPayload {
  to: string;
  subject: string;
  className: string;
  date: string;
  time: string;
  price: number;
  customerName: string;
  meetLink: string;
}

export async function sendBookingEmail({
  to,
  subject,
  className,
  date,
  time,
  price,
  customerName,
  meetLink,
}: EmailPayload) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_placeholder";
  const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";

  const emailHtml = `
    <div style="font-family: 'Outfit', sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; border: 1px solid #f2ede4; border-radius: 20px; background-color: #fdfbf7; color: #1c1917;">
      <div style="text-align: center; margin-bottom: 25px;">
        <div style="width: 50px; height: 50px; border-radius: 50px; background: linear-gradient(135deg, #c29547 0%, #cc6b49 100%); display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 24px; font-weight: bold; line-height: 50px; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">
          ॐ
        </div>
        <h2 style="font-family: 'Playfair Display', serif; margin-top: 15px; font-size: 24px; color: #1c1917; font-weight: bold;">Yog with Dhaarna</h2>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Namaste <strong>${customerName}</strong>,
      </p>
      
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
        Your reservation for <strong>${className}</strong> is fully confirmed. Below are your session and transaction receipt details:
      </p>
      
      <div style="background-color: #ffffff; border: 1px solid #f2ede4; border-radius: 15px; padding: 20px; margin-bottom: 30px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
          <tr style="border-bottom: 1px solid #f2ede4; height: 40px;">
            <td style="color: #6b6661; font-weight: 500;">Practice class</td>
            <td style="text-align: right; font-weight: bold; color: #1c1917;">${className}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f2ede4; height: 40px;">
            <td style="color: #6b6661; font-weight: 500;">Date</td>
            <td style="text-align: right; font-weight: bold; color: #1c1917;">${date}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f2ede4; height: 40px;">
            <td style="color: #6b6661; font-weight: 500;">Time window</td>
            <td style="text-align: right; font-weight: bold; color: #1c1917;">${time}</td>
          </tr>
          <tr style="height: 40px;">
            <td style="color: #6b6661; font-weight: 500;">Amount paid</td>
            <td style="text-align: right; font-weight: bold; color: #c29547; font-size: 17px;">₹${price}</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${meetLink}" target="_blank" style="background: linear-gradient(135deg, #c29547 0%, #cc6b49 100%); color: white; padding: 15px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: inline-block;">
          Join Live Google Meet Session
        </a>
      </div>

      <p style="font-size: 14px; color: #6b6661; line-height: 1.6; text-align: center; margin-top: 30px; border-top: 1px solid #f2ede4; pt: 20px;">
        Have questions? Reply directly to this email or connect via connect@yogwithdhaarna.com.<br/>
        <em>Quiet the mind, nurture the soul.</em>
      </p>
    </div>
  `;

  if (RESEND_API_KEY === "re_placeholder") {
    console.log("Mock email dispatch logged (credentials missing):");
    console.log(`To: ${to}, Subject: ${subject}`);
    return { mock: true };
  }

  try {
    const response = await axios.post(
      "https://api.resend.com/emails",
      {
        from: `Yog with Dhaarna <${SENDER_EMAIL}>`,
        to: [to],
        subject,
        html: emailHtml,
      },
      {
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Resend API email successfully delivered:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Resend API email delivery failed:", error.response?.data || error.message);
    return null;
  }
}
