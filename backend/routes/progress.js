const express = require('express')
const { getUserProgress } = require('../controllers/progressController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// Protect all progress routes
router.use(protect)

// Get current user's progress across all units
router.get('/me', getUserProgress)

module.exports = router
