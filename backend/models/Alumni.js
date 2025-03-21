// backend/models/Alumni.js
const mongoose = require('mongoose');

const AlumniSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    type: String,
    required: [true, 'Please add your current company']
  },
  role: {
    type: String,
    required: [true, 'Please add your current role']
  },
  industry: {
    type: String,
    required: [true, 'Please add your industry']
  },
  location: {
    type: String,
    required: [true, 'Please add your location']
  },
  experience: {
    type: Number,
    required: [true, 'Please add your years of experience']
  },
  skills: {
    type: [String],
    required: [true, 'Please add at least one skill']
  },
  linkedin: {
    type: String
  },
  website: {
    type: String
  },
  availableForMentoring: {
    type: Boolean,
    default: false
  },
  mentoringTopics: {
    type: [String]
  },
  mentoringCapacity: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alumni', AlumniSchema);
