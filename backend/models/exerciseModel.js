// one question/task the user answers
// exercise belongs to one lesson
// exercise belongs to one context
// exercise has many attempts

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const exerciseSchema = new Schema({
    lessonId: {
        type: Schema.Types.ObjectId,
        ref: 'Lesson',
        required: true
    },
    contextId: {
        type: Schema.Types.ObjectId,
        ref: 'Context',
        required: true
    },
    type: {
        type: String,
        enum: ['reading', 'writing', 'listening'],
        required: true
    },
    prompt: {
        type: String,
        required: true
    },
    koreanText: {
        type: String,
        required: true
    },
    englishTranslation: {
        type: String
    },
    order: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Exercise', exerciseSchema)
