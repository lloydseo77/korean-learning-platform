const express = require('express')
const {
    getLessons,
    getLesson
} = require('../controllers/lessonController')

const router = express.Router()

// GET all lessons
router.get('/', getLessons)

// GET a single lesson
router.get('/:id', getLesson)

module.exports = router