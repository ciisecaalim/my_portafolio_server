const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register); // Only for initial setup, disable later if needed
router.post('/login', login);

module.exports = router;
