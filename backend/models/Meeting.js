// models/Meeting.js
const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  meetingId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  groupId: {
    type: String,
    required: true
  },
  createdBy: {
    type: String,
    required: true
  },
  participants: [{
    type: String // User IDs
  }],
  status: {
    type: String,
    enum: ['active', 'ended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  endedAt: {
    type: Date
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number // in seconds
  }
}, {
  timestamps: true
});

// Calculate duration when meeting ends
MeetingSchema.pre('save', function(next) {
  if (this.status === 'ended' && this.endedAt && this.createdAt) {
    this.duration = Math.floor((this.endedAt - this.createdAt) / 1000);
  }
  next();
});

module.exports = mongoose.model('Meeting', MeetingSchema);
