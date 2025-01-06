import React from "react";
import Navbar from "./Shared/Navbar";
import AppliedJobTable from "./AppliedJobTable";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const AppliedJobsPage = () => {
    useGetAppliedJobs();
    const { allAppliedJobs } = useSelector(store => store.job);

    const activeAppliedJobs = allAppliedJobs.filter(job => job.job && !job.job.isDeleted);

    return (
        <>
            <Navbar />
            <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden p-8">
                        <h1 className="text-3xl font-bold text-gray-800 mb-6">Applied Jobs</h1>
                        <AppliedJobTable appliedJobs={activeAppliedJobs} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default AppliedJobsPage;