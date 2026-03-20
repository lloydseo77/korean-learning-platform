// social situation to determine register
// context has many exercises

const mongoose = require('mongoose')

const Schema = mongoose.Schema

const contextSchema = new Schema({
    name: { // "friend", "professor", "stranger"
        type: String,
        required: true
    },
    description: {
        type: String
    },
    register: {
        type: String,
        enum: ['formal', 'informal', 'mixed'],
        required: true
    },
    example: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Context', contextSchema)
