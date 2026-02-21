const { google } = require("googleapis");
const nodemailer = require("nodemailer");

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

async function sendAutoReply(toEmail, userName) {
  try {
    const accessToken = (await oAuth2Client.getAccessToken()).token;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    await transporter.sendMail({
      from: `"Ciise Caalim" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Waad ku mahadsan tahay fariintaada",
      html: `<h2>Asc ${userName} 👋</h2><p>Waad ku mahadsan tahay fariintaada.</p>`,
    });

    console.log("✅ Auto-reply email sent successfully");
  } catch (err) {
    console.error("❌ Error sending auto-reply:", err);
  }
}