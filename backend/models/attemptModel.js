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
    lessonId: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    pageIndex: {
        type: Number,
        required: true,
        default: 0
    },
    userAnswer: {
        type: Schema.Types.Mixed,
        required: true
    },
    isCorrect: {
        type: Boolean,
        required: true
    },
    xpEarned: {
        type: Number,
        default: 0
    },
    feedback: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Attempt', attemptSchema)
