const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/me', authMiddleware(), authController.getProfile);
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/users', authMiddleware('admin'), authController.createUser);
router.put('/profile', authMiddleware(), authController.updateProfile);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
