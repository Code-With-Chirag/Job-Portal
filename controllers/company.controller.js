import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js"; // Make sure to import the Job model
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// // Register Company
// export const registerCompany = async (req, res) => {
//   try {
//     const { companyName, description, website, location, logo } = req.body;

//     // Input validation
//     if (!companyName) {
//       return res.status(400).json({
//         message: "Company name is required.",
//         success: false,
//       });
//     }

//     let company = await Company.findOne({ name: companyName });
//     if (company) {
//       return res.status(400).json({
//         message: "You can't register the same company twice.",
//         success: false,
//       });
//     }

//     // Creating a new company
//     company = new Company({
//       name: companyName,
//       description,
//       website,
//       location,
//       logo,
//       userId: req.user._id
//     });

//     // Validate the model before saving
//     const validationError = company.validateSync();
//     if (validationError) {
//       return res.status(400).json({
//         message: validationError.message,
//         success: false,
//       });
//     }

//     await company.save();

//     return res.status(201).json({
//       message: "Company registered successfully.",
//       company,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "An error occurred while registering the company.",
//       success: false,
//     });
//   }
// };

// // Get Companies by User
// export const getCompany = async (req, res) => {
//   try {
//     const userId = req.id; //logged in user id
//     const companies = await Company.find({ userId });

//     if (companies.length === 0) {
//       return res.status(404).json({
//         message: "No companies found.",
//         success: false,
//       });
//     }

//     return res.status(200).json({
//       companies,
//       success: true,
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({
//       message: "An error occurred while retrieving companies.",
//       success: false,
//     });
//   }
// };


// Register Company
export const registerCompany = async (req, res) => {
  try {
    const { companyName, description, website, location, logo } = req.body;

    if (!companyName) {
      return res.status(400).json({
        message: "Company name is required.",
        success: false,
      });
    }

    let company = await Company.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({
        message: "You can't register the same company twice.",
        success: false,
      });
    }

    company = new Company({
      name: companyName,
      description,
      website,
      location,
      logo,
      userId: req.user._id, // Ensure you're using req.user._id if authenticateToken sets it
    });

    const validationError = company.validateSync();
    if (validationError) {
      return res.status(400).json({
        message: validationError.message,
        success: false,
      });
    }

    await company.save();

    return res.status(201).json({
      message: "Company registered successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while registering the company.",
      success: false,
    });
  }
};

// Get Companies by User
export const getCompany = async (req, res) => {
  try {
    const userId = req.user._id; // Logged-in user's ID
    const companies = await Company.find({ userId });

    if (companies.length === 0) {
      return res.status(404).json({
        message: "No companies found.",
        success: false,
      });
    }

    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while retrieving companies.",
      success: false,
    });
  }
};

// // Get Companies by User (Only companies created by the logged-in user)
// export const getCompany = async (req, res) => {
//   try {
//     const userId = req.id; // Logged-in user ID set by the auth middleware

//     // Fetch companies created by the logged-in user
//     const companies = await Company.find({ createdBy: userId });

//     if (companies.length === 0) {
//       return res.status(404).json({
//         message: "No companies found.",
//         success: false,
//       });
//     }

//     return res.status(200).json({
//       companies,
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       message: "An error occurred while retrieving companies.",
//       success: false,
//     });
//   }
// };

// Get Company by ID
export const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;
    const company = await Company.findById(companyId);

    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    return res.status(200).json({
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while retrieving the company.",
      success: false,
    });
  }
};

// Update Company
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    let logo;
    if (file) {
      // Upload new logo if a file is provided
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      logo = cloudResponse.secure_url;
    }

    const updateData = { name, description, website, location, logo };

    // Validate the update data before saving
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        message: "Company not found.",
        success: false,
      });
    }

    company.set(updateData);

    // Validate the updated model
    const validationError = company.validateSync();
    if (validationError) {
      return res.status(400).json({
        message: validationError.message,
        success: false,
      });
    }

    await company.save();

    return res.status(200).json({
      message: "Company information updated successfully.",
      company,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while updating the company.",
      success: false,
    });
  }
};

// // Delete Company
// export const deleteCompany = async (req, res) => {
//   try {
//     const companyId = req.params.id;

//     // Check if the company exists
//     const company = await Company.findById(companyId);
//     if (!company) {
//       return res.status(404).json({ message: 'Company not found' });
//     }

//     // Delete all jobs associated with the company
//     await Job.deleteMany({ company: companyId });

//     // Delete the company
//     const deletedCompany = await Company.findByIdAndDelete(companyId);

//     if (!deletedCompany) {
//       return res.status(400).json({ message: 'Failed to delete company' });
//     }

//     res.status(200).json({ message: 'Company and associated jobs deleted successfully', deletedCompany });
//   } catch (error) {
//     console.error("Error deleting company:", error);
//     res.status(500).json({ message: 'Failed to delete company', error: error.message });
//   }
// };


// Delete Company
export const deleteCompany = async (req, res) => {
  try {
    const companyId = req.params.id;
    const userId = req.id; // Logged-in user's ID from the auth middleware

    // Fetch the company to ensure it belongs to the logged-in user
    const company = await Company.findOne({ _id: companyId, createdBy: userId });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found or you're not authorized to delete it.",
      });
    }

    // Delete all jobs associated with the company
    await Job.deleteMany({ company: companyId });

    // Delete the company
    const deletedCompany = await company.remove();

    if (!deletedCompany) {
      return res.status(400).json({
        success: false,
        message: "Failed to delete company.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company and associated jobs deleted successfully.",
      deletedCompany,
    });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete company.",
      error: error.message,
    });
  }
};

// Get All Companies (updated)
export const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find(); // Fetch all companies

    if (companies.length === 0) {
      return res.status(404).json({
        message: "No companies found.",
        success: false,
      });
    }

    return res.status(200).json({
      companies,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while retrieving companies.",
      success: false,
    });
  }
};