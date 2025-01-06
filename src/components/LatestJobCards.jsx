import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BlurImage } from './ui/apple-cards-carousel';

const LatestJobCards = ({ job, index }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false);

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => setIsOpen(false);

    return (
        <>
            <motion.button
                layoutId={`job-card-${job._id}`}
                onClick={handleOpen}
                className="rounded-3xl bg-purple-200 dark:bg-pink-900 h-80 w-56 md:h-[40rem] md:w-96 overflow-hidden flex flex-col relative z-10"
            >
                <div className="absolute inset-0 w-full h-full">
                    <BlurImage
                        src={job?.company?.logo || '/default-company-logo.jpg'}
                        alt={`${job?.company?.name} logo`}
                        className="w-full h-full object-contain object-center"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent z-20 pointer-events-none" />
                <div className="relative z-40 p-8">
                    <motion.p
                        layoutId={`company-${job._id}`}
                        className="text-white text-sm md:text-base font-medium font-sans text-left"
                    >
                        {job?.company?.name}
                    </motion.p>
                    <motion.p
                        layoutId={`title-${job._id}`}
                        className="text-white text-xl md:text-3xl font-semibold max-w-xs text-left [text-wrap:balance] font-sans mt-2"
                    >
                        {job?.title}
                    </motion.p>
                </div>
            </motion.button>

            {isOpen && (
                <motion.div
                    layoutId={`job-card-${job._id}`}
                    className="fixed inset-0 h-screen z-50 overflow-auto bg-white dark:bg-neutral-900"
                >
                    <div className="max-w-5xl mx-auto p-4 md:p-10 font-sans relative">
                        <button
                            className="absolute top-4 right-4 h-8 w-8 bg-black dark:bg-white rounded-full flex items-center justify-center"
                            onClick={handleClose}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 text-white dark:text-black">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <motion.p
                            layoutId={`company-${job._id}`}
                            className="text-base font-medium text-black dark:text-white"
                        >
                            {job?.company?.name}
                        </motion.p>
                        <motion.p
                            layoutId={`title-${job._id}`}
                            className="text-2xl md:text-5xl font-semibold text-neutral-700 mt-4 dark:text-white"
                        >
                            {job?.title}
                        </motion.p>
                        <div className="py-10 space-y-6">
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {job?.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium">
                                    {job?.position} Positions
                                </span>
                                <span className="px-3 py-1.5 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full text-xs font-medium">
                                    {job?.jobType}
                                </span>
                                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded-full text-xs font-medium">
                                    {job?.salary} LPA
                                </span>
                            </div>
                            <button
                                onClick={() => navigate(`/description/${job._id}`)}
                                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-offset-gray-900"
                            >
                                View Full Description
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default LatestJobCards;
