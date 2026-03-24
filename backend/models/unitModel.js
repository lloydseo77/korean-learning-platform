const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  unitNumber: { type: Number, required: true, unique: true }, // e.g., 1
  title: { type: String, required: true }, // e.g., "The Inner Circle"
  description: String, // e.g., "Mastering casual speech with friends and family."
  
  // High-level social markers for the entire unit
  focusFormality: { 
    type: String, 
    enum: ['Banmal', 'Haeyo-che', 'Hasipsio-che', 'Mixed'],
    default: 'Banmal'
  },
  
  // Reference to Lessons (Optional, but helpful for population)
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  
  iconUrl: String, // For the dashboard UI
  isLockedDefault: { type: Boolean, default: true }
});

module.exports = mongoose.model('Unit', UnitSchema);