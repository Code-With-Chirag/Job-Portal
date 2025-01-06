// import { User } from "../models/user.model.js";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import getDataUri from "../utils/datauri.js";
// import cloudinary from "../utils/cloudinary.js";


// export const register = async (req,res)=>{
//     try{
//         const {fullname,email,phoneNumber,password,role}=req.body;

//         if(!fullname || !email || !phoneNumber || !password || !role){
//             return res.status(400).json({
//                 message:"Something is missing",
//                 success:false
//             });

//         };
//         const file = req.file;

//         //cloudinary comes here
//         // Convert file to base64-encoded data URI.
//         const fileUri = getDataUri(file);
//         // Upload the data URI to Cloudinary.
//         const cloudResponse = await cloudinary.uploader.upload(fileUri.content);


//         const user = await User.findOne({email});
//         if(user){
//             return res.status(400).json({
//                 message:'User already exist with this email.',
//                 success:false,
//             });
//         };   
//         const hashedPassword = await bcrypt.hash(password, 10);

//         await User.create({
//             fullname,
//             email,
//             phoneNumber,
//             password:hashedPassword,
//             role,
//             profile:{
//                 profilePhoto:cloudResponse.secure_url,
//             }


//         });
//         // if(cloudResponse){
//         //     user.profile.profilePhoto= cloudResponse.secure_url // save the cloudinary url
//         //     // user.profile.resumeOriginalName = file.originalname // Save the original file name
//         // }


//         return res.status(201).json({
//             message:"Account created successfully.",
//             success:true
//         });

//     }catch(error){
//         console.log(error);
//     }
// }

// export const login = async(req,res)=>{
//     try{
//         const{email, password,role}=req.body;
//         if(!email || !password || !role){
//             return res.status(400).json({
//                 message:"Something is missing",
//                 success:false,
//             });
//         };
//         let user = await User.findOne({email});
//         if(!user){
//             return res.status(400).json({
//                 message:"Incorrect email or password",
//                 success:false,
//             });
//         };
//         const isPasswordMatched = await bcrypt.compare(password, user.password);
//         if(!isPasswordMatched){
//             return res.status(400).json({
//                 message:"Incorrect email or password.",
//                 success:false,
//             })
//         };
//         //check role is correct or not
//         if(role != user.role){
//             return res.status(400).json({
//                 message:"Account doesn't exist with current role.",
//                 success:false,
//             });
//         };
//         //generating token
//         const tokenData = {
//             userId:user._id
//         }
//         const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn:'1d'});

//         user={
//             _id:user._id,
//             fullname:user.fullname,
//             email:user.email,
//             phoneNumber:user.phoneNumber,
//             role:user.role,
//             profile:user.profile
//         }
//         return res.status(200).cookie("token", token,{maxAge:1*24*60*60*1000, httpsOnly:true, sameSite:'strict'}).json({
//             message:`Welcome back ${user.fullname}`,
//             user,
//             success:true
//         })
//     }catch(error){
//         console.log(error);
//     }
// }

// export const logout= async (req,res) => {
//     try {
//         return res.status(200).cookie("token", "", {maxAge:0}).json({
//             message:'Logged out successfully.',
//             success:true
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

// export const updateProfile = async (req, res) => {
//     try {
//         const { fullname, email, phoneNumber, bio, skills } = req.body;
//         const file = req.file;

//         // Check if the file exists
//         if (!file) {
//             return res.status(400).json({
//                 message: "No file uploaded.",
//                 success: false,
//             });
//         }

//         // Convert file to base64-encoded data URI.
//         const fileUri = getDataUri(file);
//         // Upload the data URI to Cloudinary.
//         const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

//         // Convert skills to an array if provided
//         let skillsArray;
//         if (skills) {
//             skillsArray = skills.split(",");
//         }

//         const userId = req.id; // middleware authentication

//         let user = await User.findById(userId);

//         if (!user) {
//             return res.status(400).json({
//                 message: "User not found",
//                 success: false,
//             });
//         }

//         // Update fields if they are provided
//         if (fullname) user.fullname = fullname;
//         if (email) user.email = email;
//         if (phoneNumber) user.phoneNumber = phoneNumber;
//         if (bio) user.profile.bio = bio;
//         if (skills) user.profile.skills = skillsArray;

//         // Save the updated user data
//         if (cloudResponse) {
//             user.profile.Resume = cloudResponse.secure_url; // Save the Cloudinary URL
//             user.profile.resumeOriginalName = file.originalname; // Save the original file name
//         }

//         await user.save();

//         return res.status(200).json({
//             message: "Profile updated successfully.",
//             user,
//             success: true
//         });

//     } catch (error) {
//         console.log("Error in updateProfile:", error);
//         return res.status(500).json({
//             message: "An error occurred while updating the profile.",
//             success: false,
//             error: error.message,
//         });
//     }
// };





import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";



export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;


        if (role === "Admin") {
            const adminCount = await User.countDocuments({ role: "Admin" });
            if (adminCount >= 2) {
                return res.status(403).json({
                    success: false,
                    message: "Admin signups are restricted by Author.",
                });
            }
        }

        // Validate required fields
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }



        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // File handling with Cloudinary
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role, // Assign the role selected during signup
            profile: {
                profilePhoto: cloudResponse.secure_url,
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "An error occurred during registration.",
            success: false,
            error: error.message
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false,
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password",
                success: false,
            });
        };
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        //check role is correct or not
        if (role != user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false,
            });
        };
        //generating token
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, skills, company, location, experience } = req.body;
        const resumeFile = req.files?.file?.[0];
        const profilePhotoFile = req.files?.profilePhoto?.[0];
        const userId = req.id;

        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found",
                success: false,
            });
        }

        // Update common fields for all users
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        

        

        // Update fields specific to recruiters
        if (user.role === 'Recruiter') {
            if (company) user.profile.Company = company;
            if (location) user.profile.Location = location;
            if (experience) user.profile.Experience = experience;
        } else {
            // Update fields specific to job seekers
            if (skills) user.profile.skills = skills.split(",").map(skill => skill.trim());

            if (resumeFile) {
                const fileUri = getDataUri(resumeFile);
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                user.profile.Resume = cloudResponse.secure_url;
                user.profile.resumeOriginalName = resumeFile.originalname;
            }
        }

        // Update profile photo for all users
        if (profilePhotoFile) {
            const profilePhotoUri = getDataUri(profilePhotoFile);
            const cloudResponse = await cloudinary.uploader.upload(profilePhotoUri.content);
            user.profile.profilePhoto = cloudResponse.secure_url;
        }

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });

    } catch (error) {
        console.log("Error in updateProfile:", error);
        return res.status(500).json({
            message: "An error occurred while updating the profile.",
            success: false,
            error: error.message,
        });
    }
};
