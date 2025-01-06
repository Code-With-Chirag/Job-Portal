import React, { useState, useEffect } from "react";
import Navbar from "../Shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import axios from "axios";
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, Trash2 } from "lucide-react";

const JobUpdate = () => {
  const { jobId } = useParams(); // Get job ID from URL parameters
  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "",
    experience: "",
    position: 0,
    companyId: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { companies } = useSelector((store) => store.company);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          setInput(res.data.job);
        } else {
          toast.error("Failed to fetch job details.");
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };

    fetchJob();
  }, [jobId]);

  const validateField = (name, value) => {
    let error = "";
    const stringValue = typeof value === 'string' ? value : String(value); // Ensure value is a string

    switch (name) {
      case "title":
      case "description":
      case "location":
      case "jobType":
        if (!stringValue.trim()) error = `${name.replace(/([A-Z])/g, ' $1')} is required.`;
        break;
      case "requirements":
        if (!stringValue.trim()) error = "Job Requirements are required.";
        else if (!Array.isArray(stringValue.split(",")) || stringValue.split(",").length === 0)
          error = "Requirements should be a non-empty array.";
        break;
      case "salary":
        if (!stringValue) error = "Salary is required.";
        else if (isNaN(stringValue) || stringValue <= 0)
          error = "Salary must be a positive number.";
        break;
      case "experience":
        if (!stringValue) error = "Experience Level is required.";
        else if (isNaN(stringValue) || stringValue < 0)
          error = "Experience Level must be a positive number.";
        break;
      case "position":
        if (!stringValue) error = "Number of Positions is required.";
        else if (isNaN(stringValue) || stringValue < 1)
          error = "Number of Positions must be at least 1.";
        break;
      case "companyId":
        if (!stringValue) error = "Company is required.";
        break;
      default:
        break;
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: error }));
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({ ...prevInput, [name]: value }));
    validateField(name, value); // Validate on change
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value); // Validate on blur
  };

  const selectChangeHandler = (value) => {
    const selectedCompany = companies.find(
      (company) => company.name.toLowerCase() === value
    );
    const companyId = selectedCompany ? selectedCompany._id : "";
    setInput((prevInput) => ({ ...prevInput, companyId }));
    validateField("companyId", companyId);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // Perform validation for all fields
    Object.keys(input).forEach((key) => validateField(key, input[key]));

    if (Object.values(errors).some((error) => error)) {
      toast.error("Please fix the validation errors.");
      return; // Exit if there are validation errors
    }

    try {
      setLoading(true);
      // Send PUT request to update job
      const res = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("Update Response:", res.data); // Log the response

      // Check if the update was successful
      if (res.data.message === 'Job updated successfully') {
        toast.success('Job updated successfully.');
        console.log("Navigating to /admin/jobs");
        navigate("/admin/jobs");
      } else {
        toast.error(res.data.message || "Update failed."); // Handle missing message
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message); // Log the error response
      const errorMessage = error.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(`${JOB_API_END_POINT}/delete/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.message === 'Job deleted successfully') {
        toast.success('Job deleted successfully.');
        navigate('/admin/jobs');
      } else {
        toast.error('Failed to delete job.');
      }
    } catch (error) {
      console.error("Error Data:", error.response?.data);
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-screen my-5">
        <form
          onSubmit={submitHandler}
          className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md"
        >
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>Job Role</Label>
              <Input
                type="text"
                name="title"
                value={input.title}
                onChange={handleChange}
                onBlur={handleBlur}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
            </div>
            <div>
              <Label>Description</Label>
              <Input
                type="text"
                name="description"
                value={input.description}
                onChange={handleChange}
                onBlur={handleBlur}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
              {errors.description && (
                <p className="text-red-600 text-sm">{errors.description}</p>
              )}
            </div>
            <div>
              <Label>Requirements</Label>
              <Input
                type="text"
                name="requirements"
                value={input.requirements}
                onChange={handleChange}
                onBlur={handleBlur}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
              {errors.requirements && (
                <p className="text-red-600 text-sm">{errors.requirements}</p>
              )}
            </div>
            <div>
              <Label>Salary</Label>
              <Input
                type="text"
                name="salary"
                value={input.salary}
                onChange={handleChange}
                onBlur={handleBlur}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
              {errors.salary && (
                <p className="text-red-600 text-sm">{errors.salary}</p>
              )}
            </div>
            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={input.location}
                onChange={handleChange}
                onBlur={handleBlur}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
              {errors.location && (
                <p className="text-red-600 text-sm">{errors.location}</p>
              )}
            </div>
            <div>
              <Label>Job Type</Label>
              <Input
                type="text"
                name="jobType"
                value={input.jobType}
                onChange={handleChange}
                onBlur={handleBlur}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
              {errors.jobType && (
                <p className="text-red-600 text-sm">{errors.jobType}</p>
              )}
            </div>
            <div>
              <Label>Experience Level</Label>
              <Input
                type="text"
                name="experience"
                value={input.experience}
                onChange={handleChange}
                onBlur={handleBlur}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
              {errors.experience && (
                <p className="text-red-600 text-sm">{errors.experience}</p>
              )}
            </div>
            <div>
              <Label>No of Positions</Label>
              <Input
                type="number"
                name="position"
                value={input.position}
                onChange={handleChange}
                onBlur={handleBlur}
                className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1"
              />
              {errors.position && (
                <p className="text-red-600 text-sm">{errors.position}</p>
              )}
            </div>
            <div>
              <Label>Company</Label>
              <Select onValueChange={selectChangeHandler}>
                <SelectTrigger className="focus-visible:ring-offset-0 focus-visible:ring-0 my-1">
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies.map((company) => (
                      <SelectItem
                        key={company._id}
                        value={company.name.toLowerCase()}
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors.companyId && (
                <p className="text-red-600 text-sm">{errors.companyId}</p>
              )}
            </div>
          </div>
          {loading ? (
            <Button className="w-full my-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Please wait
            </Button>
          ) : (
            <>
              <Button
                type="submit"
                className="w-full my-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
              >
                Update
              </Button>
              <Button
                type="button"
                onClick={handleDelete}
                className="w-full my-4 bg-red-500 text-white hover:bg-red-600 transition duration-300 flex items-center justify-center"
              >
                <Trash2 className="mr-2 h-5 w-5" />
                Delete Job
              </Button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default JobUpdate;
