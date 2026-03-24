const Attempt = require('../models/attemptModel')
const UserProgress = require('../models/userProgressModel')
const Lesson = require('../models/lessonModel')
const mongoose = require('mongoose')

// create an attempt (submit answer)
const createAttempt = async (req, res) => {
    try {
        const { lessonId, pageIndex, userAnswer, isCorrect, xpEarned } = req.body
        const userId = req.userId

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({error: 'Invalid lesson ID'})
        }

        // Get the lesson to find its unit
        const lesson = await Lesson.findById(lessonId)
        if (!lesson) {
            return res.status(404).json({error: 'Lesson not found'})
        }

        // Create attempt record
        const attempt = await Attempt.create({
            userId,
            lessonId,
            pageIndex,
            userAnswer,
            isCorrect,
            xpEarned: xpEarned || 0
        })

        // Update user progress if correct
        if (isCorrect) {
            const userProgress = await UserProgress.findOne({
                userId,
                unitId: lesson.unit._id || lesson.unit // Could be ObjectId or number
            })

            if (userProgress) {
                userProgress.totalXpEarned += (xpEarned || 0)
                
                // Mark lesson as completed if all exercises done (simplified)
                const lessonProgress = userProgress.lessonProgress.find(
                    lp => lp.lessonId.toString() === lessonId
                )
                if (lessonProgress) {
                    lessonProgress.attemptsMade += 1
                }
                
                await userProgress.save()
            }
        }

        res.status(201).json(attempt)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// get user's attempts for a lesson
const getAttempts = async (req, res) => {
    try {
        const { lessonId, pageIndex } = req.query
        const userId = req.userId

        let query = { userId }
        
        if (lessonId) query.lessonId = lessonId
        if (pageIndex) query.pageIndex = pageIndex

        const attempts = await Attempt.find(query)
            .sort({createdAt: -1})

        res.status(200).json(attempts)
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

module.exports = {
    createAttempt,
    getAttempts
}