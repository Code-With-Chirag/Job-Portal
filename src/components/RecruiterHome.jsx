import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { PlusCircle, Briefcase, FileText, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { JOB_API_END_POINT, COMPANY_API_END_POINT } from '@/utils/constant';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import socket from '@/utils/socket';
import { setAllAdminJobs } from '@/redux/jobSlice';
import { useDispatch } from 'react-redux';
import RetroGrid from './RetroGrid'; // Make sure this import path is correct

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RecruiterHome = () => {
    const { user } = useSelector((store) => store.auth);
    const { allAdminJobs } = useSelector((store) => store.job);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [recentActivities, setRecentActivities] = useState([]);
    const [userCompanies, setUserCompanies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserData = useCallback(async () => {
        if (!user) {
            setIsLoading(false);
            return;
        }

        try {
            const [jobsResponse, companiesResponse] = await Promise.all([
                axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true }),
                axios.get(`${COMPANY_API_END_POINT}/user`, { withCredentials: true })
            ]);

            const jobs = jobsResponse.data.jobs || [];
            const fetchedCompanies = companiesResponse.data.companies || [];

            const activities = [
                ...jobs.map(job => ({
                    type: 'job',
                    message: `You posted a new job: "${job.title}"`,
                    date: new Date(job.createdAt)
                })),
                ...fetchedCompanies.map(company => ({
                    type: 'company',
                    message: `You registered a new company: "${company.name}"`,
                    date: new Date(company.createdAt)
                }))
            ];

            activities.sort((a, b) => b.date.getTime() - a.date.getTime());

            dispatch(setAllAdminJobs(jobs));
            setUserCompanies(fetchedCompanies);
            setRecentActivities(activities.slice(0, 5));
            setIsLoading(false);
            setError(null);
        } catch (error) {
            // console.error('Error fetching user data:', error);
            // setError('Failed to fetch user data. Please try again later.');
            dispatch(setAllAdminJobs([]));
            setUserCompanies([]);
            setRecentActivities([]);
            setIsLoading(false);
        }
    }, [dispatch, user]);

    useEffect(() => {
        fetchUserData();

        const handleJobDeleted = (deletedJobId) => {
            dispatch(setAllAdminJobs(prevJobs => prevJobs.filter(job => job._id !== deletedJobId)));
            setRecentActivities(prevActivities =>
                prevActivities.filter(activity =>
                    !(activity.type === 'job' && activity.message.includes(deletedJobId))
                )
            );
        };

        socket.on('jobDeleted', handleJobDeleted);

        return () => {
            socket.off('jobDeleted', handleJobDeleted);
        };
    }, [fetchUserData]);

    // Remove or comment out this console.log
    // console.log('Render - isLoading:', isLoading, 'user:', user);

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    // Data for charts
    const data = {
        labels: ['Posted Jobs', 'Registered Companies'],
        datasets: [
            {
                label: 'Count',
                data: [allAdminJobs?.length || 0, userCompanies.length],
                backgroundColor: ['#6A38C2', '#38A169'],
                borderColor: ['#6A38C2', '#38A169'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
                position: 'top',
            },
            title: {
                display: true,
                text: 'Jobs and Companies Overview',
            },
        },
    };

    return (
        <div className='relative min-h-screen flex flex-col'>
            <RetroGrid className="absolute inset-0 z-0 w-full h-full" />
            <div className="relative z-10 flex-grow p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-gray-800">Welcome, {user?.fullname}!</h1>

                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
                            <strong className="font-bold">Error: </strong>
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <StatCard icon={<Briefcase className="w-8 h-8" />} title="Posted Jobs" value={allAdminJobs?.length || 0} />
                        <StatCard icon={<Building className="w-8 h-8" />} title="Registered Companies" value={userCompanies.length} />
                    </div>

                    {(allAdminJobs?.length === 0 && userCompanies.length === 0) ? (
                        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-12" role="alert">
                            <p className="font-bold">Welcome, new recruiter!</p>
                            <p>It looks like you haven't posted any jobs or registered any companies yet. Get started by using the quick actions below.</p>
                        </div>
                    ) : (
                        <>
                            {/* Bar Chart */}
                            <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8 mb-12">
                                <h2 className="text-2xl font-semibold mb-6 text-gray-700">Job and Company Statistics</h2>
                                <Bar data={data} options={options} />
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-green-200 rounded-lg shadow-lg p-8 mb-12">
                                <h2 className="text-2xl font-semibold mb-6 text-gray-700">Recent Activity</h2>
                                {recentActivities.length > 0 ? (
                                    <ul className="space-y-4">
                                        {recentActivities.map((activity, index) => (
                                            <li key={index} className="flex items-center">
                                                {activity.type === 'job' ? (
                                                    <Briefcase className="w-5 h-5 mr-3 text-blue-500" />
                                                ) : (
                                                    <Building className="w-5 h-5 mr-3 text-green-500" />
                                                )}
                                                <span className="text-gray-700">{activity.message}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-600">No recent activity to display.</p>
                                )}
                            </div>
                        </>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white bg-opacity-80 rounded-lg shadow-lg p-8 mb-12">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-700">Quick Actions</h2>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={() => navigate('/admin/jobs/create')}
                                className="bg-[#6A38C2] text-white hover:bg-[#5A2CB2] transition-colors px-6 py-3 text-lg"
                            >
                                <PlusCircle className="mr-2 h-5 w-5" /> Post New Job
                            </Button>
                            <Button
                                onClick={() => navigate('/admin/jobs')}
                                variant="outline"
                                className="bg-[#38A169] text-white hover:bg-[#5A2CB2] transition-colors px-6 py-3 text-lg"
                            >
                                <FileText className="mr-2 h-5 w-5" /> View My Jobs
                            </Button>
                            <Button
                                onClick={() => navigate('/admin/companies/create')}
                                className="bg-[#6A38C2] text-white hover:bg-[#2F855A] transition-colors px-6 py-3 text-lg"
                            >
                                <Building className="mr-2 h-5 w-5" /> Register Company
                            </Button>
                            <Button
                                onClick={() => navigate('/admin/companies')}
                                className="bg-[#38A169] text-white hover:bg-[#5A2CB2] transition-colors px-6 py-3 text-lg"
                            >
                                <Building className="mr-2 h-5 w-5" /> View Your Companies
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value }) => (
    <div className="bg-white bg-opacity-80 rounded-lg shadow-lg flex items-center p-4">
        <div className="mr-4 text-[#6A38C2]">{icon}</div>
        <div>
            <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
            <p className="text-3xl font-bold text-[#6A38C2]">{value}</p>
        </div>
    </div>
);

export default RecruiterHome;
