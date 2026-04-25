const express = require('express')
const { getUserProgress, resetLessonProgress } = require('../controllers/progressController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// Protect all progress routes
router.use(protect)

// Get current user's progress across all units
router.get('/me', getUserProgress)

// Reset a specific lesson's progress
router.delete('/lessons/:lessonId', resetLessonProgress)

module.exports = router
