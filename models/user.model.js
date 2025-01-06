import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, "Full Name is required."],
    trim: true, // Removes leading and trailing spaces
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      "Please enter a valid email address.",
    ], // Regex validation for email format
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required."],
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number."], // Regex to ensure 10 digits
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [6, "Password should be at least 6 characters long."], // Minimum length for password
  },
  role: {
    type: String,
    enum: ["Job_Seeker", "Recruiter", "Admin"],
    default: "Job_Seeker",
    required: [true, "Role is required."],
  },
  profile: {
    bio: { type: String },
    skills: [{ type: String }],
    Resume: { type: String }, // URL to resume file
    resumeOriginalName: { type: String },
    Company: { type: String },
    Location: { type: String }, // For recruiters
    Experience: { type: Number }, // For recruiters (in years)
    profilePhoto: {
      type: String,
      default: "",
    },
  },
  jobsPosted: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  applicationsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Application' }],
  hiredCandidates: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const User = mongoose.model("User", userSchema);
export default User;





