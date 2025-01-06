import React, { useEffect, useState } from "react";
import { Label } from "../ui/label";
import Navbar from "../Shared/Navbar.jsx";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import loginImage from '/src/assets/Login.png'; // Add this import
import { Eye, EyeOff } from "lucide-react"; // Add this import

const LogIn = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false); // Add this state

  const [errors, setErrors] = useState({});
  const { loading, user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) {
          return "Email is required.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          return "Email is invalid.";
        }
        break;
      case "password":
        if (!value) {
          return "Password is required.";
        } else if (value.length < 6) {
          return "Password should be at least 6 characters.";
        }
        break;
      case "role":
        if (!value) {
          return "Please select a role.";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });

    // Validate field on change
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate all fields before submitting
    const allErrors = {
      email: validateField("email", input.email),
      password: validateField("password", input.password),
      role: validateField("role", input.role),
    };

    setErrors(allErrors);

    if (Object.values(allErrors).some((error) => error)) return;

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 403) {
        toast.error("Admin logins are limited to a maximum of 2 users.");
      } else {
        toast.error(error.response.data.message);
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

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
            <img src={loginImage} alt="Log In" className="w-full h-full object-cover " />
          </div>
          <div className="w-full lg:w-1/2 p-8">
            <h1 className="font-bold text-2xl mb-6 text-gray-800">LogIn</h1>
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="text"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  onBlur={handleBlur}
                  placeholder="Enter Your Email"
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-none"
                />
                {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={input.password}
                    onChange={changeEventHandler}
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
                <Label className="text-sm font-medium text-gray-700">Role</Label>
                <RadioGroup
                  className="flex space-x-4"
                  value={input.role}
                  onValueChange={(value) => {
                    setInput((prevInput) => ({ ...prevInput, role: value }));
                    setErrors((prevErrors) => ({ ...prevErrors, role: '' }));
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

              {/* {loading ? (
                <Button className="w-full bg-blue-500 text-white hover:bg-blue-600 transition duration-300 flex items-center justify-center" disabled>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Please wait
                </Button>
              ) : (
              )} */}
              <Button
                type="submit"
                className="w-full bg-green-500 text-white hover:bg-green-600 transition duration-300"
              >
                Login
              </Button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Don't have an account?{" "}
              <Link to="/SignUp" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LogIn;
