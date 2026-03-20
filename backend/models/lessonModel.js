// unit of learning based on one target concept
// lesson has many exercises
// lesson has many progress records

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
    },
    contexts: [{
        type: Schema.Types.ObjectId,
        ref: 'Context'
    }]
}, { timestamps: true })

module.exports = mongoose.model('Lesson', lessonSchema)