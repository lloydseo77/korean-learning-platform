const mongoose = require('mongoose')
const UserProgress = require('./models/userProgressModel')
require('dotenv').config()

const resetLessonProgress = async (userId, lessonId) => {
  await mongoose.connect(process.env.MONGO_URI)
  
  try {
    const userProgress = await UserProgress.findOne({ userId })
    
    if (!userProgress) {
      console.log('❌ User progress not found')
      return
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
    console.log('✓ Lesson progress reset successfully')
    console.log(`User: ${userId}`)
    console.log(`Lesson: ${lessonId}`)
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    mongoose.connection.close()
  }
}

// Run: node resetProgress.js <userId> <lessonId>
const [userId, lessonId] = process.argv.slice(2)

if (!userId || !lessonId) {
  console.log('Usage: node resetProgress.js <userId> <lessonId>')
  console.log('Example: node resetProgress.js 507f1f77bcf86cd799439011 507f1f77bcf86cd799439012')
  process.exit(1)
}

resetLessonProgress(userId, lessonId)
