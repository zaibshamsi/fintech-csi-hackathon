const express = require('express');
const router = express.Router();
const { updateUserSettings } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');


router.put('/settings', protect, updateUserSettings);

module.exports = router;