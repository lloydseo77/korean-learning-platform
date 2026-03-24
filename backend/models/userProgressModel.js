const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  unitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Unit', required: true },
  
  totalXpEarned: { type: Number, default: 0 },
  lessonsCompleted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  isUnlocked: { type: Boolean, default: false },
  
  // Track progress on each lesson
  lessonProgress: [
    {
      lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
      attemptsMade: { type: Number, default: 0 },
      isCompleted: { type: Boolean, default: false },
      completedAt: Date
    }
  ]
}, { timestamps: true });

// Compound index: one progress record per user per unit
UserProgressSchema.index({ userId: 1, unitId: 1 }, { unique: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);