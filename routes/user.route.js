import express from "express";
import {  login, logout, register, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import multer from 'multer';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.route("/register").post(upload.single('file'), register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(
    isAuthenticated,
    upload.fields([
        { name: 'file', maxCount: 1 },
        { name: 'profilePhoto', maxCount: 1 }
    ]),
    updateProfile
);


export default router;





// import express from "express";
// import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
// import isAuthenticated, { adminAuth, recruiterAuth, jobSeekerAuth } from "../middlewares/isAuthenticated.js";
// import { singleUpload } from "../middlewares/multer.js";

// const router = express.Router();

// // User Registration Route
// router.route("/register").post(singleUpload, register);

// // User Login Route
// router.route("/login").post(login);

// // User Logout Route
// router.route("/logout").get(logout);

// // Update User Profile Route (Protected)
// router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

// // Admin-only route
// router.get("/admin/dashboard", isAuthenticated, adminAuth, (req, res) => {
//     res.json({ message: "Welcome Admin!" });
// });

// // Recruiter-only route
// router.get("/recruiter/dashboard", isAuthenticated, recruiterAuth, (req, res) => {
//     res.json({ message: "Welcome Recruiter!" });
// });

// // Job Seeker-only route
// router.get("/job-seeker/dashboard", isAuthenticated, jobSeekerAuth, (req, res) => {
//     res.json({ message: "Welcome Job Seeker!" });
// });

// export default router;
