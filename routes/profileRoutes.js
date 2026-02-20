const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const {
    uploadProfileImage,
    getProfile
} = require("../controllers/profileController");

// Upload
router.post("/upload", upload.single("image"), uploadProfileImage);

// Get
router.get("/", getProfile);

module.exports = router;
