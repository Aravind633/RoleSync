import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    
    // --- Candidate Specific Fields ---
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: { type: Number, default: 0 },
    location: { type: String },
    resumeUrl: { type: String }, 
    parsedSkills: { type: [String], default: [] }, // NLP extracted skills
    
    // --- Recruiter Specific Fields ---
    companyName: { type: String },
    companyWebsite: { type: String },
    designation: { type: String },
  },
  { timestamps: true }
);

// Indexing for the Matching Engine
// This ensures queries filtering by candidate skills and location are lightning fast
profileSchema.index({ skills: 1, location: 1 });

export const Profile = mongoose.model('Profile', profileSchema);