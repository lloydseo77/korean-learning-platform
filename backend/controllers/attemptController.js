const Attempt = require('../models/attemptModel')
const UserProgress = require('../models/userProgressModel')
const Lesson = require('../models/lessonModel')
const Unit = require('../models/unitModel')
const mongoose = require('mongoose')

// create an attempt (submit answer)
const createAttempt = async (req, res) => {
    try {
        const { lessonId, pageIndex, userAnswer, isCorrect, xpEarned } = req.body
        const userId = req.userId

        // Validate required fields
        if (!lessonId) {
            return res.status(400).json({error: 'lessonId is required'})
        }
        if (pageIndex === undefined || pageIndex === null) {
            return res.status(400).json({error: 'pageIndex is required'})
        }
        if (userAnswer === undefined) {
            return res.status(400).json({error: 'userAnswer is required'})
        }
        if (isCorrect === undefined) {
            return res.status(400).json({error: 'isCorrect is required'})
        }

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({error: 'Invalid lesson ID'})
        }

        // Get the lesson to find its unit
        const lesson = await Lesson.findById(lessonId)
        if (!lesson) {
            return res.status(404).json({error: 'Lesson not found'})
        }

        // Get the Unit by unitNumber to get its ObjectId
        const unit = await Unit.findOne({ unitNumber: lesson.unit })
        if (!unit) {
            return res.status(404).json({error: 'Unit not found'})
        }

        // If correct, use lesson's xpReward if not provided
        const earnedXp = xpEarned !== undefined ? xpEarned : (isCorrect ? lesson.xpReward : 0)

        // Create attempt record
        const attempt = await Attempt.create({
            userId,
            lessonId,
            pageIndex,
            userAnswer,
            isCorrect,
            xpEarned: earnedXp
        })

        // Update user progress if correct
        if (isCorrect) {
            const userProgress = await UserProgress.findOne({
                userId,
                unitId: unit._id
            })

            // Create user progress if it doesn't exist
            if (!userProgress) {
                userProgress = new UserProgress({
                    userId,
                    unitId: unit._id,
                    totalXpEarned: earnedXp,
                    isUnlocked: true,
                    lessonsCompleted: [],
                    lessonProgress: [{
                        lessonId,
                        attemptsMade: 1,
                        isCompleted: false
                    }]
                })
            } else {
                userProgress.totalXpEarned += earnedXp
                
                // Create lesson progress if it doesn't exist
                let lessonProgress = userProgress.lessonProgress.find(
                    lp => lp.lessonId.toString() === lessonId
                )
                if (!lessonProgress) {
                    userProgress.lessonProgress.push({
                        lessonId,
                        attemptsMade: 1,
                        isCompleted: false
                    })
                } else {
                    lessonProgress.attemptsMade += 1
                }
            }
            
            await userProgress.save()
        }

        res.status(201).json(attempt)
    } catch (error) {
        console.error('Error creating attempt:', error)
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

// Mark lesson as complete
const completeLesson = async (req, res) => {
    try {
        const { lessonId } = req.body
        const userId = req.userId

        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            return res.status(400).json({error: 'Invalid lesson ID'})
        }

        const lesson = await Lesson.findById(lessonId)
        if (!lesson) {
            return res.status(404).json({error: 'Lesson not found'})
        }

        // Get the Unit by unitNumber to get its ObjectId
        const unit = await Unit.findOne({ unitNumber: lesson.unit })
        if (!unit) {
            return res.status(404).json({error: 'Unit not found'})
        }

        // Get or create user progress for this lesson's unit
        let userProgress = await UserProgress.findOne({
            userId,
            unitId: unit._id
        })

        if (!userProgress) {
            // Create user progress if it doesn't exist
            userProgress = new UserProgress({
                userId,
                unitId: unit._id,
                totalXpEarned: 0,
                isUnlocked: true,
                lessonsCompleted: [],
                lessonProgress: []
            })
        }

        // Mark lesson as completed
        if (!userProgress.lessonsCompleted.includes(lessonId)) {
            userProgress.lessonsCompleted.push(lessonId)
        }

        // Update lesson progress
        let lessonProgress = userProgress.lessonProgress.find(
            lp => lp.lessonId.toString() === lessonId
        )
        
        if (!lessonProgress) {
            // Create lesson progress if it doesn't exist
            lessonProgress = {
                lessonId,
                attemptsMade: 1,
                isCompleted: true,
                completedAt: new Date()
            }
            userProgress.lessonProgress.push(lessonProgress)
        } else {
            lessonProgress.isCompleted = true
            lessonProgress.completedAt = new Date()
        }

        await userProgress.save()

        res.status(200).json({
            message: 'Lesson completed',
            userProgress,
            totalXpEarned: userProgress.totalXpEarned
        })
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

module.exports = {
    createAttempt,
    getAttempts,
    completeLesson
}