import React, { useEffect, useState, useMemo } from 'react'
import Navbar from './Shared/Navbar'
import Job from './Job';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import ShineBorder from './ui/shine-border';
import { AnimatedGridPattern } from './ui/AnimatedGridPattern';
import { useLocation } from 'react-router-dom';

const Browse = () => {
    useGetAllJobs();
    const allJobs = useSelector(store => store.job.allJobs);
    const dispatch = useDispatch();
    const location = useLocation();
    const [query, setQuery] = useState("");

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const initialQuery = searchParams.get('query') || "";
        setQuery(initialQuery);
        dispatch(setSearchedQuery(initialQuery));

        return () => {
            dispatch(setSearchedQuery(""));
        }
    }, [location.search, dispatch]);

    const filteredJobs = useMemo(() => {
        return allJobs.filter(job => {
            const searchTerm = query.toLowerCase();
            return (
                (job.title && typeof job.title === 'string' && job.title.toLowerCase().includes(searchTerm)) ||
                (job.company.name && typeof job.company.name === 'string' && job.company.name.toLowerCase().includes(searchTerm)) ||
                (job.location && typeof job.location === 'string' && job.location.toLowerCase().includes(searchTerm))
            );
        });
    }, [allJobs, query]);

    const handleSearchChange = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        dispatch(setSearchedQuery(newQuery));
    };

    return (
        <div className='relative min-h-screen bg-[#d0c7fc]'>
            <AnimatedGridPattern className="fixed inset-0 z-0 w-full h-full text-[#8358F1] opacity-30" />
            <div className="relative z-10">
                <Navbar />
                <div className='max-w-7xl mx-auto my-12 px-4 sm:px-6 lg:px-8'>
                    <h1 className='font-bold text-3xl mb-8 text-gray-900'>
                        Browse Jobs
                    </h1>
                    <div className="mb-10">
                        <ShineBorder borderRadius={8} borderWidth={2} color={["#8358F1", "#F25AE6", "#5B80F1"]} duration={10} className="w-full">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    placeholder="Search for jobs, companies, or locations"
                                    value={query}
                                    onChange={handleSearchChange}
                                    className="w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-white"
                                />
                                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            </div>
                        </ShineBorder>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Showing {filteredJobs.length} result{filteredJobs.length !== 1 ? 's' : ''}
                    </p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                        <AnimatePresence>
                            {filteredJobs.map((job) => (
                                <motion.div
                                    key={job._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className='bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300'
                                >
                                    <Job job={job} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Browse
