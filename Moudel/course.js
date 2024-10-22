const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user', 
    required: true
  },
  videos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'video' 
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('course', courseSchema);