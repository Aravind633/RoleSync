import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    skills: {
      type: [String],
      required: [true, 'Please specify at least one required skill'],
    },
    experienceLevel: {
      type: String,
      enum: ['Entry', 'Mid', 'Senior', 'Director', 'Executive'],
      default: 'Mid',
    },
    location: {
      type: String,
      required: [true, 'Job location is required (or specify Remote)'],
      trim: true,
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
    },
    status: {
      type: String,
      enum: ['open', 'closed', 'draft'],
      default: 'open',
    },
  },
  { timestamps: true }
);

jobSchema.index({ skills: 1, location: 1, status: 1 });

export const Job = mongoose.model('Job', jobSchema);