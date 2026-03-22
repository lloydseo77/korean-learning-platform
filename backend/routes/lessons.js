const express = require('express')
const { getLessons, getLesson } = require('../controllers/lessonController')
const { protect } = require('../middleware/auth')

const router = express.Router()

// GET all lessons
router.get('/', protect, getLessons)

// GET a single lesson
router.get('/:id', protect, getLesson)

module.exports = router