import mongoose from "mongoose";

// Custom validator for requirements array
const arrayNotEmpty = (val) => Array.isArray(val) && val.length > 0;

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Job Title is required."],
    trim: true, // Removes leading and trailing spaces
  },
  description: {
    type: String,
    required: [true, "Job Description is required."],
  },
  requirements: {
    type: [String],
    required: [true, "Job Requirements are required."],
    validate: [arrayNotEmpty, "Requirements should be a non-empty array"], // Custom validator
  },
  salary: {
    type: Number,
    required: [true, "Salary is required."],
    min: [0, "Salary must be a positive number"], // Minimum salary validation
  },
  experienceLevel: {
    type: Number,
    required: [true, "Experience Level is required."],
    min: [0, "Experience Level must be a positive number"], // Minimum experience validation
  },
  location: {
    type: String,
    required: [true, "Location is required."],
    trim: true, // Removes leading and trailing spaces
  },
  jobType: {
    type: String,
    required: [true, "Job Type is required."],
  },
  position: {
    type: Number,
    required: [true, "Number of Positions is required."],
    min: [1, "Number of Positions must be at least 1"], // Minimum positions validation
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: [true, "Company is required."],
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Creator is required."],
  },
  applications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    }
  ],
  acceptedApplications: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
    }
  ],
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export const Job = mongoose.model("Job", jobSchema);
export default Job;
