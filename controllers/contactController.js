// controllers/contactController.js
const Message = require('../models/Message');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

// Function to send auto-reply email using Gmail OAuth2
async function sendAutoReply(toEmail, userName) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    await transporter.sendMail({
      from: `"Ciise Caalim" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: 'Waad ku mahadsan tahay fariintaada',
      html: `
        <h2>Asc ${userName} 👋</h2>
        <p>Waad ku mahadsan tahay fariintaada.</p>
        <p>Waan kula soo xiriiri doonaa sida ugu dhaqsaha badan.</p>
        <br/>
        <b>Best Regards,</b>
        <p>Ciise Caalim</p>
      `,
    });

    console.log('✅ Auto-reply email sent to:', toEmail);
  } catch (err) {
    console.error('❌ Failed to send auto-reply:', err);
  }
}

// POST /api/contact → save message & send auto-reply
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save to MongoDB
    const newMessage = await Message.create({ name, email, message });

    // Send auto-reply (async, no need to block response)
    sendAutoReply(email, name)
      .then(() => {
        newMessage.replied = true;
        newMessage.repliedAt = new Date();
        return newMessage.save();
      })
      .catch((err) => console.error('Auto-reply save failed:', err));

    res.status(201).json({ success: true, message: 'Message received and auto-reply sent!' });
  } catch (err) {
    console.error('🔥 SEND MESSAGE ERROR:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/contact → get all messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    console.error('🔥 GET MESSAGES ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/contact/:id → delete message
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('🔥 DELETE ERROR:', err);
    res.status(500).json({ message: err.message });
  }
};