// import jwt from "jsonwebtoken";

// const isAuthenticated = async (req,res, next) =>{
//     try {
//         const token = req.cookies.token;
//         if(!token){
//              return res.status(401).json({
//                 message:"User not authenticated",
//                 success:false,
//              })
//         }
//         const decode = await jwt.verify(token, process.env.SECRET_KEY);
//         if(!decode){
//             return res.status(401).json({
//                 message:"Invalid token",
//                 success:false
//             })
//         };
//         req.id = decode.userId;
//         next();
//     } catch (error) {
//         console.log(error);
//     }
// }
// export default isAuthenticated;





// import jwt from "jsonwebtoken";

// // Middleware to check if the user is authenticated
// const isAuthenticated = async (req, res, next) => {
//     try {
//         const token = req.cookies.token;
//         if (!token) {
//             return res.status(401).json({
//                 message: "User not authenticated",
//                 success: false,
//             });
//         }

//         try {
//             const decode = jwt.verify(token, process.env.SECRET_KEY);
//             req.user = decode;
//             req.id = decode.userId;
//             req.role = decode.role;
//             next();
//         } catch (jwtError) {
//             if (jwtError instanceof jwt.TokenExpiredError) {
//                 return res.status(401).json({
//                     message: "Token expired. Please log in again.",
//                     success: false,
//                 });
//             }
//             throw jwtError; // Re-throw if it's not a TokenExpiredError
//         }
//     } catch (error) {
//         console.log(error);
//         return res.status(401).json({
//             message: "Authentication error",
//             success: false,
//         });
//     }
// };

// export default isAuthenticated;












import jwt from "jsonwebtoken";
import User from "../models/user.model.js"; // Adjust the path as necessary

// Middleware to check if the user is authenticated
const isAuthenticated = async (req, res, next) => {
    try {
        // Extract token from cookies
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "No token provided. User not authenticated",
                success: false,
            });
        }

        // Verify the token
        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            // Fetch the user from the database
            req.user = await User.findById(decoded.userId); // Ensure you have the right field for user ID
            if (!req.user) {
                return res.status(401).json({
                    message: "User not found",
                    success: false,
                });
            }
            // Pass along user info if needed
            req.id = decoded.userId;
            req.role = decoded.role;
            next();
        } catch (jwtError) {
            if (jwtError instanceof jwt.TokenExpiredError) {
                return res.status(401).json({
                    message: "Token expired. Please log in again.",
                    success: false,
                });
            }
            // Handle other JWT errors
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            message: "Authentication error",
            success: false,
        });
    }
};

export default isAuthenticated;
