const Lesson = require('../models/lessonModel')
const mongoose = require('mongoose')

// get all lessons
const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({})
            .sort({order: 1})

        res.status(200).json(lessons)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

// get a single lesson
const getLesson = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({error: 'No such lesson'})
        }

        const lesson = await Lesson.findById(id)
        
        if (!lesson) {
            return res.status(404).json({error: 'No such lesson'})
        }

        res.status(200).json(lesson)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//  get lessons by unit
const getLessonsByUnit = async (req, res) => {
    try {
        const { unitNumber } = req.params

        const lessons = await Lesson.find({ unit: unitNumber })
            .sort({order: 1})

        res.status(200).json(lessons)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = {
    getLessons,
    getLesson,
    getLessonsByUnit
}