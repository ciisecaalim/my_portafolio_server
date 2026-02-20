const Profile = require("../models/Profile");

// Upload Profile Image
// Update Profile (Image + Info)
exports.uploadProfileImage = async (req, res) => {
    try {
        const { name, role } = req.body;
        const imagePath = req.file ? `/uploads/${req.file.filename}` : undefined;

        let profile = await Profile.findOne();

        if (profile) {
            if (imagePath) profile.image = imagePath;
            if (name) profile.name = name;
            if (role) profile.role = role;
            await profile.save();
        } else {
            profile = await Profile.create({
                image: imagePath || "",
                name: name || "Ciise Caalim",
                role: role || "Admin"
            });
        }

        res.status(200).json(profile);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Profile Image
exports.getProfile = async (req, res) => {
    try {
        const profile = await Profile.findOne();
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
