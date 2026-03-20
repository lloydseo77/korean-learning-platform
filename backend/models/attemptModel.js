// single user submission for an exercise
// attempt belongs to one user
// attempt belongs to one exercise

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const attemptSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exerciseId: {
        type: Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    lessonId: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    userAnswer: {
        type: String,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    feedback: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Attempt', attemptSchema)
