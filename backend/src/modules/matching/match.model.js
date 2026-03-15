import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.ObjectId,
    ref: 'Job',
    required: true
  },
  candidate: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  details: {
    skillsMatch: Number,     // out of 70
    experienceMatch: Number, // out of 15
    locationMatch: Number    // out of 15
  }
}, {
  timestamps: true
});


matchSchema.index({ job: 1, candidate: 1 }, { unique: true });

export const Match = mongoose.model('Match', matchSchema);