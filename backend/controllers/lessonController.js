const Lesson = require('../models/lessonModel')
const Context = require('../models/contextModel')
const Exercise = require('../models/exerciseModel')
const mongoose = require('mongoose')

// get all lessons
const getLessons = async (req, res) => {
    try {
        const lessons = await Lesson.find({})
            .populate('contexts')
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

        const lesson = await Lesson.findById(id).populate('contexts')
        
        if (!lesson) {
            return res.status(404).json({error: 'No such lesson'})
        }

        // Get exercises for this lesson
        const exercises = await Exercise.find({lessonId: id})
            .populate('contextId')
            .sort({order: 1})

        res.status(200).json({
            ...lesson.toObject(),
            exercises
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = {
    getLessons,
    getLesson
}