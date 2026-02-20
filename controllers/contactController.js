const Message = require('../models/Message');
const nodemailer = require('nodemailer');

// Email transporter
const createTransporter = () => {
    console.log("Creating email transporter...");
    return nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        family: 4
    });
};

// Send message + auto-reply
exports.sendMessage = async (req, res) => {
    console.log("📩 /api/contact called");
    console.log("Request Body:", req.body);

    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            console.log("❌ Missing fields");
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log("💾 Saving message to MongoDB...");
        const newMessage = await Message.create({ name, email, message });
        console.log("✅ Message saved:", newMessage._id);

        // Respond first
        res.status(201).json({ success: true, message: "Message sent successfully" });

        // Auto-reply email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && email) {
            try {
                console.log("📧 Sending auto-reply email...");

                const transporter = createTransporter();

                await transporter.sendMail({
                    from: `"Ciise Caalim" <${process.env.EMAIL_USER}>`,
                    to: email,
                    subject: "Waad ku mahadsan tahay fariintaada",
                    html: `
                        <h2>Asc ${name} 👋</h2>
                        <p>Waad ku mahadsan tahay fariintaada.</p>
                        <p>Waan kula soo xiriiri doonaa sida ugu dhaqsaha badan.</p>
                        <br/>
                        <b>Best Regards,</b>
                        <p>Ciise Caalim</p>
                    `
                });

                console.log("✅ Auto-reply email sent");

                newMessage.replied = true;
                newMessage.repliedAt = new Date();
                await newMessage.save();

            } catch (emailError) {
                console.error("❌ Auto-reply email failed:", emailError);
            }
        } else {
            console.log("⚠️ Email credentials missing, skipping auto-reply");
        }

    } catch (err) {
        console.error("🔥 SEND MESSAGE ERROR:");
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

// Get all messages
exports.getMessages = async (req, res) => {
    console.log("📥 GET /api/contact");

    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        console.log("✅ Messages fetched:", messages.length);
        res.json(messages);
    } catch (err) {
        console.error("🔥 GET MESSAGES ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};

// Delete message
exports.deleteMessage = async (req, res) => {
    console.log("🗑 DELETE /api/contact/:id", req.params.id);

    try {
        await Message.findByIdAndDelete(req.params.id);
        console.log("✅ Message deleted");
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        console.error("🔥 DELETE ERROR:", err);
        res.status(500).json({ message: err.message });
    }
};
