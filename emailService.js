const Message = require('../models/Message');
const nodemailer = require('nodemailer');

// Gmail App Password Method
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Send Auto Reply
async function sendAutoReply(toEmail, userName) {
  try {
    const info = await transporter.sendMail({
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

    console.log("✅ Auto-reply sent:", info.response);
  } catch (err) {
    console.error("❌ Email error:", err);
  }
}

// POST /api/contact
exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Save message
    const newMessage = await Message.create({ name, email, message });

    // Send auto reply (async)
    sendAutoReply(email, name)
      .then(() => {
        newMessage.replied = true;
        newMessage.repliedAt = new Date();
        return newMessage.save();
      })
      .catch((err) => console.error("Reply save error:", err));

    res.status(201).json({
      success: true,
      message: 'Message received and auto-reply sent!'
    });

  } catch (err) {
    console.error("🔥 SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET messages
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE message
exports.deleteMessage = async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};