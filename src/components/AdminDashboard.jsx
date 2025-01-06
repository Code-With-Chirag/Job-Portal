import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ADMIN_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Button } from "./ui/button";
import Navbar from "./Shared/Navbar";
import { AnimatedGridPattern } from "./ui/AnimatedGridPattern";


const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ADMIN_API_END_POINT}/users`, {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };
  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Get token from localStorage or cookies
      const token = localStorage.getItem("token"); // Assuming you're storing the JWT in localStorage

      const response = await axios.get(`${ADMIN_API_END_POINT}/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
        withCredentials: true, // Send credentials if using cookies for auth
      });
      setJobs(response.data.jobs); // Adjust based on API response structure
    } catch (error) {
      toast.error("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${ADMIN_API_END_POINT}/companies`, {
        withCredentials: true,
      });
      if (response.data && Array.isArray(response.data.companies)) {
        setCompanies(response.data.companies);
      } else {
        console.error("Unexpected response format:", response.data);
        toast.error("Unexpected response format when fetching companies.");
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast.error(`Failed to fetch companies: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchJobs();
    fetchCompanies();
  }, []);



  const handleDeleteUser = async (userId) => {
    try {
      setLoading(true);
      await axios.delete(`${ADMIN_API_END_POINT}/users/${userId}`, {
        withCredentials: true,
      });
      toast.success("User deleted successfully.");
      // Refresh user list
      const response = await axios.get(`${ADMIN_API_END_POINT}/users`, {
        withCredentials: true,
      });
      setUsers(response.data);
    } catch (error) {
      toast.error("Failed to delete user.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      setLoading(true);
      await axios.delete(`${ADMIN_API_END_POINT}/jobs/${jobId}`, {
        withCredentials: true,
      });
      toast.success("Job deleted successfully.");
      // Refresh job list
      const response = await axios.get(`${ADMIN_API_END_POINT}/jobs`, {
        withCredentials: true,
      });
      setJobs(response.data.jobs);
    } catch (error) {
      toast.error("Failed to delete job.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company? All associated jobs will also be deleted.")) {
      return;
    }

    setLoading(true);
    try {
      // Optimistic update
      setCompanies(companies.filter(company => company._id !== companyId));
      setJobs(jobs.filter(job => job.company !== companyId));

      const response = await axios.delete(`${ADMIN_API_END_POINT}/companies/${companyId}`, {
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success("Company and associated jobs deleted successfully.");
        // Fetch fresh data to ensure consistency
        await fetchCompanies();
        await fetchJobs();
      } else {
        throw new Error('Failed to delete company');
      }
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error(`Failed to delete company: ${error.response?.data?.message || error.message}`);
      // Revert optimistic update
      await fetchCompanies();
      await fetchJobs();
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="relative min-h-screen bg-[#d0c7fc] flex flex-col">
      <AnimatedGridPattern className="fixed inset-0 z-0 w-full h-full text-[#8358F1] opacity-30" />
      <Navbar />
      <div className="relative z-10 flex-grow flex flex-col items-center justify-center p-6">

        <h1 className="text-4xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
        {loading && <p className="text-lg text-gray-700">Loading...</p>}

        {/* User Management Section */}
        <div className="w-full max-w-4xl bg-purple-200 shadow-lg rounded-lg p-8 mb-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">User Management</h2>
          <h3 className="text-xl font-semibold mt-6 mb-4">All Users</h3>
          <ul className="space-y-4">
            {users.map((user) => (
              <li
                key={user._id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-800">
                  {user.name} ({user.email}) - {user.role}
                </span>
                <Button
                  onClick={() => handleDeleteUser(user._id)}
                  className="bg-red-500 text-white hover:bg-red-600 transition duration-300 py-2 px-4 rounded-lg text-sm"
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Job Management Section */}
        <div className="w-full max-w-4xl bg-purple-200 shadow-lg rounded-lg p-8 mb-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">Manage Jobs</h2>
          <h3 className="text-xl font-semibold mb-4">All Jobs</h3>
          <ul className="space-y-4">
            {jobs.map((job) => (
              <li
                key={job._id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-800">
                  <strong className="text-lg">{job.title}</strong> - {job.description} - {job.company?.name}
                  <span className={`font-semibold ${job.status === "Open" ? "text-green-600" : "text-red-600"}`}>
                    {job.status}
                  </span>
                </span>
                <Button
                  onClick={() => handleDeleteJob(job._id)}
                  className="bg-red-500 text-white hover:bg-red-600 transition duration-300 py-2 px-4 rounded-lg text-sm"
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>

        {/* Companies Management Section */}
        <div className="w-full max-w-4xl bg-purple-200 shadow-lg rounded-lg p-8 mb-6 border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b border-gray-300 pb-2">Manage Companies</h2>
          <h3 className="text-xl font-semibold mb-4">All Companies</h3>
          <ul className="space-y-4">
            {companies.map((company) => (
              <li
                key={company._id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md hover:bg-gray-200 transition-colors"
              >
                <span className="text-gray-800">
                  <strong>{company.name}</strong> - {company.location}
                </span>
                <Button
                  onClick={() => handleDeleteCompany(company._id)}
                  className="bg-red-500 text-white hover:bg-red-600 transition duration-300 py-2 px-4 rounded-lg text-sm"
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
