import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    // 1-to-1 linking back to the Auth User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Strictly enforces that one user can only have one profile
    },
    firstName: { 
      type: String, 
      required: [true, 'First name is required'],
      trim: true 
    },
    lastName: { 
      type: String, 
      required: [true, 'Last name is required'],
      trim: true 
    },
    
    //  Candidate Specific Fields 
    skills: {
      type: [String],
      default: [],
    },
    experienceYears: { 
      type: Number, 
      default: 0 
    },
    location: { 
      type: String,
      trim: true 
    },
    resumeUrl: { 
      type: String,
      trim: true
    }, 
    parsedSkills: { 
      type: [String], 
      default: [] 
    }, // NLP extracted skills
    
    // Recruiter Specific Fields 
    companyName: { 
      type: String,
      trim: true 
    },
    companyWebsite: { 
      type: String,
      trim: true 
    },
    designation: { 
      type: String,
      trim: true 
    },
  },
  { timestamps: true }
);

// Indexing for the Matching Engine

profileSchema.index({ skills: 1, location: 1 });

export const Profile = mongoose.model('Profile', profileSchema);