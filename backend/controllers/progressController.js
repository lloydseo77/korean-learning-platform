const UserProgress = require('../models/userProgressModel')
const Unit = require('../models/unitModel')

// Get all user progress across all units
const getUserProgress = async (req, res) => {
  try {
    const userId = req.userId

    // Get all units
    const units = await Unit.find().sort({ unitNumber: 1 })
    
    // Get all user progress records
    const progressRecords = await UserProgress.find({ userId }).lean()

    // Build response with all units and their lesson progress
    const allProgress = []
    
    for (const unit of units) {
      const unitProgress = progressRecords.find(p => p.unitId.toString() === unit._id.toString())
      
      allProgress.push({
        unitId: unit._id,
        unitNumber: unit.unitNumber,
        isUnlocked: unitProgress?.isUnlocked ?? false,
        totalXpEarned: unitProgress?.totalXpEarned ?? 0,
        lessonsCompleted: unitProgress?.lessonsCompleted ?? [],
        lessonProgress: unitProgress?.lessonProgress ?? []
      })
    }

    // Also return flattened version for easier frontend access
    const flatProgress = {
      totalXp: progressRecords.reduce((sum, p) => sum + (p.totalXpEarned || 0), 0),
      progress: allProgress
    }

    res.json(flatProgress)
  } catch (error) {
    console.error('Error fetching user progress:', error)
    res.status(500).json({ error: error.message })
  }
}

// Reset a specific lesson's progress
const resetLessonProgress = async (req, res) => {
  try {
    const userId = req.userId
    const { lessonId } = req.params

    const userProgress = await UserProgress.findOne({ userId })
    
    if (!userProgress) {
      return res.status(404).json({ error: 'User progress not found' })
    }

    // Remove from completed lessons
    userProgress.lessonsCompleted = userProgress.lessonsCompleted.filter(
      id => id.toString() !== lessonId
    )

    // Reset lesson progress entry
    const lessonProgress = userProgress.lessonProgress.find(
      lp => lp.lessonId.toString() === lessonId
    )
    
    if (lessonProgress) {
      lessonProgress.isCompleted = false
      lessonProgress.completedAt = null
      lessonProgress.attemptsMade = 0
    }

    await userProgress.save()
    res.json({ message: 'Lesson progress reset', userProgress })
  } catch (error) {
    console.error('Error resetting lesson progress:', error)
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getUserProgress,
  resetLessonProgress
}
