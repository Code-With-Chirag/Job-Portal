import express from "express";
import { register, login, logout, updateProfile } from "../controllers/admin.controller.js";
import { getAllUsers, deleteUser } from "../controllers/admin.controller.js";

import { singleUpload } from "../middlewares/multer.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { deleteCompany, getCompanies } from "../controllers/company.controller.js";
import { deleteJob, getAllJobs } from "../controllers/job.controller.js";

const router = express.Router();

// Admin registration and login
router.route("/signup").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout);


// Admin profile update
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

// Admin-specific routes
router.route("/users").get(getAllUsers);
router.route("/users/:id").delete(deleteUser);

// Company management routes
router.route("/companies").get(isAuthenticated, getCompanies); // Get all companies

// Add this new route for deleting a company
router.route("/companies/:id")
    .delete(isAuthenticated, deleteCompany); // Delete company by ID

// Job management routes
router.route("/jobs").get(isAuthenticated, getAllJobs); // Get all jobs
router.route("/jobs/:id").delete(isAuthenticated, deleteJob); // Delete job by ID

export default router;