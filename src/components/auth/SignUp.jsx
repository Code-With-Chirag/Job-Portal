import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import Navbar from "../Shared/Navbar.jsx";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice";
import { Loader2, UserCircle, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import signUpImage from '/src/assets/Signup.png'; // Add this import

const SignUp = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullname":
        if (!value.trim()) {
          error = "Full Name is required.";
        }
        break;
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
          error = "Please enter a valid email.";
        }
        break;
      case "phoneNumber":
        const phoneRegex = /^\d{10}$/;
        if (!value || !phoneRegex.test(value)) {
          error = "Please enter a valid 10-digit phone number.";
        }
        break;
      case "password":
        if (value.length < 6) {
          error = "Password should be at least 6 characters long.";
        }
        break;
      case "role":
        if (!value) {
          error = "Please select a role.";
        }
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'radio') {
      setInput((prevInput) => ({ ...prevInput, role: value }));
    } else {
      setInput((prevInput) => ({ ...prevInput, [name]: value }));
    }
    validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value); // Validate on blur
  };

  const handleFileChange = (e) => {
    setInput((prevInput) => ({ ...prevInput, file: e.target.files?.[0] }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // Perform validation for all fields
    Object.keys(input).forEach((key) => validateField(key, input[key]));

    if (Object.values(errors).some((error) => error)) {
      return; // Exit if there are validation errors
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/LogIn");
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Admin signups are Restricted by Author.");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      dispatch(setLoading(false));
    }
  }

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-white shadow-xl rounded-2xl overflow-hidden flex"
        >
          <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-[#360033] to-[#0b8793]">
            <img src={signUpImage} alt="Sign Up" className="w-full h-full object-cover " />
          </div>
          <div className="w-full lg:w-1/2 p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                <UserCircle className="mx-auto h-12 w-12 text-indigo-600" />
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-800 mt-4">Join Questcareers</h1>
              <p className="text-gray-600">Start your career journey today</p>
            </div>

            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-sm font-medium text-gray-700">Full Name</Label>
                <Input
                  id="fullname"
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Your Full Name"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-none"
                />
                {errors.fullname && <p className="text-red-600 text-sm">{errors.fullname}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Your Email"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-none"
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={input.phoneNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="Enter Your Contact Number"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-none"
                />
                {errors.phoneNumber && <p className="text-red-600 text-sm">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={input.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter Your Password"
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-none pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="file" className="text-sm font-medium text-gray-700">Profile Picture</Label>
                <Input
                  id="file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Role</Label>
                <RadioGroup
                  className="flex space-x-4"
                  value={input.role}
                  onValueChange={(value) => {
                    setInput((prevInput) => ({ ...prevInput, role: value }));
                    validateField('role', value);
                  }}
                >
                  <div className="flex items-center">
                    <RadioGroupItem id="Job_Seeker" value="Job_Seeker" />
                    <Label htmlFor="Job_Seeker" className="ml-2 text-sm text-gray-700">Job Seeker</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem id="Recruiter" value="Recruiter" />
                    <Label htmlFor="Recruiter" className="ml-2 text-sm text-gray-700">Recruiter</Label>
                  </div>
                  <div className="flex items-center">
                    <RadioGroupItem id="Admin" value="Admin" />
                    <Label htmlFor="Admin" className="ml-2 text-sm text-gray-700">Admin</Label>
                  </div>
                </RadioGroup>
                {errors.role && <p className="text-red-600 text-sm">{errors.role}</p>}
              </div>

              <div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing Up...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/LogIn" className="font-medium text-indigo-600 hover:text-indigo-500">
                Log In
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
