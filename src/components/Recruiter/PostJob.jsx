import React, { useState } from "react";
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
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PostJob = () => {
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
  const { user } = useSelector((store) => store.auth);

  // Filter companies to only show those created by the current recruiter
  const recruiterCompanies = companies.filter(
    (company) => company.userId === user._id
  );

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "title":
        if (!value.trim()) error = "Job Title is required.";
        break;
      case "description":
        if (!value.trim()) error = "Job Description is required.";
        break;
      case "requirements":
        if (!value.trim()) error = "Job Requirements are required.";
        else if (
          !Array.isArray(value.split(",")) ||
          value.split(",").length === 0
        )
          error = "Requirements should be a non-empty array.";
        break;
      case "salary":
        if (!value) error = "Salary is required.";
        else if (isNaN(value) || value <= 0)
          error = "Salary must be a positive number.";
        break;
      case "experience":
        if (!value) error = "Experience Level is required.";
        else if (isNaN(value) || value < 0)
          error = "Experience Level must be a positive number.";
        break;
      case "location":
        if (!value.trim()) error = "Location is required.";
        break;
      case "jobType":
        if (!value.trim()) error = "Job Type is required.";
        break;
      case "position":
        if (!value) error = "Number of Positions is required.";
        else if (isNaN(value) || value < 1)
          error = "Number of Positions must be at least 1.";
        break;
      case "companyId":
        if (!value) error = "Company is required.";
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
    const selectedCompany = recruiterCompanies.find(
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
      const res = await axios.post(`${JOB_API_END_POINT}/post`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(error.response.data.message);
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
              <Label>Title</Label>
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
            {recruiterCompanies.length > 0 && (
              <div>
                <Label>Company</Label>
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {recruiterCompanies.map((company) => (
                        <SelectItem
                          key={company._id}
                          value={company?.name?.toLowerCase()}
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
            )}
            {recruiterCompanies.length === 0 && (
              <p className="text-xs text-red-600 font-bold text-center my-3">
                *Please register a company first, before posting a job
              </p>
            )}
          </div>
          {loading ? (
            <Button className="w-full my-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300 flex items-center justify-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full my-4 bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
            >
              Submit
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostJob
