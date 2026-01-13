const mongoose = require('mongoose')

const Schema = mongoose.Schema

const lessonSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    order: {
        type: Number,
        required: true
    },
    targetConcept: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Lesson', lessonSchema)