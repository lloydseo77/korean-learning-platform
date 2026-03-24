const Unit = require('../models/unitModel')
const Lesson = require('../models/lessonModel')
const UserProgress = require('../models/userProgressModel')
const mongoose = require('mongoose')

// get all units
const getUnits = async (req, res) => {
    try {
        const units = await Unit.find({})
            .populate('lessons')
            .sort({unitNumber: 1})

        res.status(200).json(units)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

// get single unit with lessons and user progress
const getUnit = async (req, res) => {
    try {
        const { id } = req.params
        const userId = req.userId

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(404).json({error: 'No such unit'})
        }

        const unit = await Unit.findById(id).populate('lessons')
        if (!unit) {
            return res.status(404).json({error: 'No such unit'})
        }

        // Get user's progress for this unit
        const userProgress = await UserProgress.findOne({
            userId,
            unitId: id
        })

        res.status(200).json({
            unit,
            userProgress
        })
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = {
    getUnits,
    getUnit
}