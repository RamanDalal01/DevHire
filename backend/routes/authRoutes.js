const express = require('express');
const { register, login, getMe, uploadResume, updateProfile } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/upload', protect, authorize('developer'), upload.single('resume'), uploadResume);
router.put('/profile', protect, updateProfile);

module.exports = router;
