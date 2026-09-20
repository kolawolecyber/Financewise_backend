const express = require('express');
const router = express.Router();


const authController = require('../controllers/AuthController')
const { authRateLimit } = require("../middleware/authRateLimitMiddleware");


// REGISTER
router.post('/register', authRateLimit, authController.signup);

// LOGIN
router.post('/login', authRateLimit, authController.login );

module.exports = router;
