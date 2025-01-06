import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import adminAuth from "../middlewares/adminAuth.js"; // Import the adminAuth middleware
import { deleteJob, getAdminJobs, getAllJobs, getJobById, postJob, updateJob, createJob } from "../controllers/job.controller.js";
// import { io } from '../server.js'; // Import io
import { io } from '../index.js'; // Import io

const router = express.Router();

router.route("/post").post(isAuthenticated, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/admin/jobs/:id").get(getJobById)
// Route for updating a job by ID
router.route('/update/:id').put(isAuthenticated, updateJob);

// Route for deleting a job by ID
router.route('/delete/:id').delete(isAuthenticated, deleteJob);

// Emit an event when a new job is created
router.post('/create', isAuthenticated, adminAuth, async (req, res) => {
    try {
        const job = await createJob(req.body);
        io.emit('jobCreated', job);
        res.status(201).json(job);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/all', async (req, res) => {
    try {
        const jobs = await getAllJobs();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
