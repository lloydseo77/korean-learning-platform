const express = require('express')
const { registerUser, loginUser, getCurrentUser } = require('../controllers/authController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// POST register
router.post('/register', registerUser)

// POST login
router.post('/login', loginUser)

// GET current user
router.get('/me', protect, getCurrentUser)

module.exports = router
