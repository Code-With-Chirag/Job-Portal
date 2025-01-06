import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { Application } from "../models/application.model.js";
import { isValidObjectId } from "../utils/utils.js";
import { io } from '../index.js'; // Import the Socket.IO instance

// Admin post a job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        // Create a new job object with the provided data
        const jobData = {
            title,
            description,
            requirements: requirements.split(","),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        };

        // Create a new job instance and validate
        const job = new Job(jobData);
        await job.validate(); // Validate the job instance

        // Save the job if validation passes
        const savedJob = await job.save();

        return res.status(201).json({
            message: "New job created successfully.",
            job: savedJob,
            success: true
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // Handle validation errors
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        console.log(error);
        res.status(500).json({ message: 'Error creating job', error: error.message });
    }
};

// Get all jobs
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };

        const jobs = await Job.find(query).populate("company").sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }
};

// Get job by ID
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate("applications");

        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching job', error: error.message });
    }
};

// Get jobs created by admin
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({ created_by: adminId }).populate("company").sort({ createdAt: -1 });

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            });
        }

        return res.status(200).json({
            jobs,
            success: true
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching admin jobs', error: error.message });
    }
};

// Approve a job
export const approveJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job approved successfully', job });
    } catch (error) {
        res.status(500).json({ message: 'Error approving job', error: error.message });
    }
};

// Reject a job
export const rejectJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job rejected successfully', job });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting job', error: error.message });
    }
};

// Update a job
export const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        console.log("Job ID:", jobId);

        // Validate jobId
        if (!isValidObjectId(jobId)) {
            return res.status(400).json({ message: 'Invalid Job ID format.' });
        }

        if (!jobId) {
            return res.status(400).json({ message: 'Job ID is missing.' });
        }

        const updateData = req.body;

        const updatedJob = await Job.findByIdAndUpdate(jobId, updateData, { new: true });

        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json({ message: 'Job updated successfully', job: updatedJob });
    } catch (error) {
        res.status(500).json({ message: 'Error updating job', error: error.message });
    }
};

// Delete a job
export const deleteJob = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedJob = await Job.findByIdAndDelete(id);
        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Emit a 'jobDeleted' event to all connected clients
        io.emit('jobDeleted', id);

        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const applyForJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const applicantId = req.user._id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: "Job not found" });
        }

        const existingApplication = await Application.findOne({ job: jobId, applicant: applicantId });
        if (existingApplication) {
            return res.status(400).json({ message: "You have already applied for this job" });
        }

        const newApplication = await Application.create({
            job: jobId,
            applicant: applicantId,
        });

        job.applications.push(newApplication._id);
        await job.save();

        const recruiter = await User.findById(job.created_by);
        recruiter.applicationsReceived.push(newApplication._id);
        await recruiter.save();

        res.status(201).json({ message: "Application submitted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error submitting application" });
    }
};

export const acceptApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }

        application.status = 'accepted';
        await application.save();

        const job = await Job.findById(application.job);
        job.acceptedApplications.push(application._id);
        await job.save();

        const recruiter = await User.findById(job.created_by);
        recruiter.hiredCandidates.push(application.applicant);
        await recruiter.save();

        res.status(200).json({ message: "Application accepted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error accepting application" });
    }
};

export const createJob = async (jobData) => {
    try {
        const newJob = new Job(jobData);
        await newJob.save();
        return newJob;
    } catch (error) {
        throw new Error('Error creating job: ' + error.message);
    }
};