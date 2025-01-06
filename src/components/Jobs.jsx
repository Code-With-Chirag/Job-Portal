import React, { useEffect, useState } from "react";
import Navbar from "./Shared/Navbar";
import FilterCard from "./FilterCard";
import Job from "./Job";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Briefcase } from "lucide-react";
import { HoverEffectCard } from "./ui/HoverEffectCard";
import { AnimatedGridPattern } from "./ui/AnimatedGridPattern";

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchedQuery) {
      const filteredJobs = allJobs.filter((job) => {
        const { location, jobRole, salary } = searchedQuery;
        return (
          (!location || job.location.toLowerCase().includes(location.toLowerCase())) &&
          (!jobRole || job.title.toLowerCase().includes(jobRole.toLowerCase())) &&
          (!salary || job.salary >= salary)
        );
      });
      setFilterJobs(filteredJobs);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  const handleGoToAppliedJobs = () => {
    navigate("/appliedjobs");
  };

  return (
    <div className="relative min-h-screen bg-[#d0c7fc]">
      <div className="fixed inset-0 z-0">
        <AnimatedGridPattern className="w-full h-full text-[#8358F1] opacity-30" />
      </div>
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-4 mb-8">
            <FilterCard />
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Available Jobs</h2>
            <Button
              onClick={handleGoToAppliedJobs}
              className="bg-emerald-500 hover:bg-emerald-600 text-white flex items-center px-4 py-2 rounded-full transition duration-300 ease-in-out"
            >
              <Briefcase className="w-5 h-5 mr-2" />
              View Applied Jobs
            </Button>
          </div>
          {filterJobs.length <= 0 ? (
            <div className="bg-white/80 backdrop-blur-sm shadow-md rounded-lg p-8 text-center">
              <span className="text-gray-500 text-xl">No jobs found matching your criteria</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterJobs.map((job) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  key={job?._id}
                >
                  <HoverEffectCard>
                    <Job job={job} />
                  </HoverEffectCard>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
