const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    image: {
        type: String,
        required: false
    },
    name: {
        type: String,
        default: "Ciise Caalim"
    },
    role: {
        type: String,
        default: "Admin"
    }
}, { timestamps: true });

module.exports = mongoose.model("Profile", profileSchema);
