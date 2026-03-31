const express = require('express')
const { createAttempt, getAttempts, completeLesson } = require('../controllers/attemptController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// POST complete lesson (specific route first)
router.post('/complete', protect, completeLesson)

// POST create attempt (generic route after specific)
router.post('/', protect, createAttempt)

// GET user's attempts
router.get('/', protect, getAttempts)

module.exports = router