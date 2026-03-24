const express = require('express')
const { createAttempt, getAttempts } = require('../controllers/attemptController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// POST create attempt
router.post('/', protect, createAttempt)

// GET user's attempts
router.get('/', protect, getAttempts)

module.exports = router