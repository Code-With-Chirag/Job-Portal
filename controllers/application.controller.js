import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";

// Handle job application by users
export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if (!jobId) {
            return res.status(400).json({
                message: "Job id is required.",
                success: false
            });
        }
        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ job: jobId, applicant: userId });
        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            });
        }
        // Check if the job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(400).json({
                message: "Job not found.",
                success: false
            });
        }
        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId,
        });
        
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(201).json({
            message: "Application submitted successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
    }
};

// Get all jobs applied by the current user
export const getAppliedJobs = async (req, res) => {
    try {
        const userId = req.id;
        const application = await Application.find({ applicant: userId }).sort({ createdAt: -1 }).populate({
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'company',
                options: { sort: { createdAt: -1 } },
            }
        });
        if (!application) {
            return res.status(404).json({
                message: "No Applications.",
                success: false
            });
        }
        return res.status(200).json({
            application,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
};

// Admin view all applicants for a specific job
export const getApplicants = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path: 'applications',
            options: { sort: { createdAt: -1 } },
            populate: {
                path: 'applicant'
            }
        });
        if (!job) {
            return res.status(404).json({
                message: "No Job Found.",
                success: false
            });
        }

        return res.status(200).json({
            job,
            success: true
        });

    } catch (error) {
        console.log(error);
    }
};

// Update the status of a job application
export const updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const applicationId = req.params.id;
        if (!status) {
            return res.status(400).json({
                message: "Please provide a status.",
                success: false
            });
        }

        // Find the application by application id
        const application = await Application.findOne({ _id: applicationId });
        if (!application) {
            return res.status(404).json({
                message: "Application not found.",
                success: false
            });
        }

        // Update the status
        application.status = status.toLowerCase();
        await application.save();
        return res.status(200).json({
            message: "Status Updated Successfully.",
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

// Get all applications (Admin only)
export const getAllApplications = async (req, res) => {
    try {
        const applications = await Application.find();
        res.status(200).json(applications);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching applications', error: error.message });
    }
};

// Update application status (Admin only)
export const updateApplicationStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }
        res.status(200).json({ message: 'Application status updated successfully', application });
    } catch (error) {
        res.status(500).json({ message: 'Error updating application status', error: error.message });
    }
};



export const deleteApplicant = async (req, res) => {
    try {
        const applicantId = req.params.id;
        const result = await Application.findByIdAndDelete(applicantId);
        
        if (!result) {
            return res.status(404).json({ message: 'Applicant not found', success: false });
        }

        res.status(200).json({ message: 'Applicant deleted successfully', success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting applicant', success: false });
    }
};