// import express from "express";
// import {
//   deleteCompany,
//   getCompanies,
//   getCompany,
//   getCompanyById,
//   registerCompany,
//   updateCompany
  
// } from "../controllers/company.controller.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";
// import { singleUpload } from "../middlewares/multer.js";

// const router = express.Router();

// // Routes for company operations
// router.route("/register").post(isAuthenticated, registerCompany);
// router.route("/get").get(isAuthenticated, getCompany);
// router.route("/get/:id").get(isAuthenticated, getCompanyById);
// router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);
// router.route("/delete/:id").delete(isAuthenticated, deleteCompany);
// router.route("/getAll").get( getCompanies);



// export default router;



// company.routes.js

import express from 'express';
import {
  deleteCompany,
  getCompany, // Fetch companies by logged-in user
  getCompanyById,
  registerCompany,
  updateCompany,
  getCompanies // Fetch all companies
} from '../controllers/company.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
import { singleUpload } from '../middlewares/multer.js';

const router = express.Router();

// Register a new company (must be authenticated)
router.post('/register', isAuthenticated, registerCompany);

// Get companies by logged-in user (must be authenticated)
router.get('/user', isAuthenticated, getCompany);

// Other routes
router.get('/get/:id', isAuthenticated, getCompanyById);
router.put('/update/:id', isAuthenticated, singleUpload, updateCompany);
router.delete('/delete/:id', isAuthenticated, deleteCompany);

// Fetch all companies
router.get('/', isAuthenticated, getCompanies);

export default router;


