// unit of learning based on one target concept
// lesson has many exercises
// lesson has many progress records

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Subdocument schemas for page content
const infoPageSchema = new Schema({
  header: String,
  body: String,
  examples: [{
    polite: String,
    casual: String
  }],
  audioUrl: String,
  visualAid: String
}, { _id: false });

const exercisePageSchema = new Schema({
  question: String,
  interactionType: {
    type: String,
    enum: ['MULTIPLE_CHOICE', 'DRAG_MATCH', 'OPEN_ENDED'],
    required: true
  },
  // For MULTIPLE_CHOICE
  options: [{
    text: String,
    isCorrect: Boolean,
    feedback: String
  }],
  // For DRAG_MATCH
  pairs: [{
    id: String,
    left: String,
    right: String
  }],
  // For OPEN_ENDED
  acceptableAnswers: [String],
  hints: [String],
  characterReaction: String
}, { _id: false });

const pageSchema = new Schema({
  pageType: {
    type: String,
    enum: ['INFO', 'EXERCISE'],
    required: true
  },
  content: Schema.Types.Mixed // Can be infoPageSchema or exercisePageSchema
}, { _id: false });

const LessonSchema = new Schema({
  title: { type: String, required: true }, // e.g., "The Same-Age Coffee Trap"
  unit: { type: Number, required: true },  // e.g., 1
  missionGoal: String,                     // e.g., "Ask Minsu to speak casually"
  
  // The "Social Profile" Header data
  socialContext: {
    recipientName: String,     // e.g., "Minsu"
    recipientRole: String,     // e.g., "Classmate"
    hierarchy: { 
      type: String, 
      enum: ['Higher', 'Equal', 'Lower'], 
      default: 'Equal' 
    },
    closeness: { 
      type: String, 
      enum: ['Stranger', 'Acquaintance', 'Friend', 'Family'], 
      default: 'Stranger' 
    }
  },

  // The actual content of the lesson
  pages: [pageSchema],
  
  order: Number,
  xpReward: { type: Number, default: 100 }
}, { timestamps: true });

module.exports = mongoose.model('Lesson', LessonSchema);