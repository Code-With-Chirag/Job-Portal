import React, { useEffect, useState } from 'react';
import { FaUsers, FaBriefcase, FaBuilding } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs';
import useGetAllUsers from '@/hooks/useGetAllUsers';
import { setCompanies } from '../redux/companySlice.js';
import axios from 'axios';
import { ADMIN_API_END_POINT, COMPANY_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import socket from '../utils/socket';
import { setJobs } from '../redux/jobSlice.js';
import RetroGrid from './RetroGrid'; // Import RetroGrid

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminHome = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const { allJobs } = useSelector(store => store.job);
    const { companies } = useSelector(store => store.company);
    const { users } = useSelector(store => store.user);

    const jobsLoading = useGetAllAdminJobs();
    const setUsers = useGetAllUsers();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get(`${ADMIN_API_END_POINT}/companies`, { withCredentials: true });
                if (response.data && Array.isArray(response.data.companies)) {
                    dispatch(setCompanies(response.data.companies));
                }
            } catch (error) {
                console.error('Failed to fetch companies:', error);
            }
        };

        fetchCompanies();
    }, [dispatch]);

    useEffect(() => {
        const fetchRecentActivities = async () => {
            try {
                const jobsResponse = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
                const companiesResponse = await axios.get(`${COMPANY_API_END_POINT}/user`, { withCredentials: true });

                const jobs = jobsResponse.data.jobs || [];
                const companies = companiesResponse.data.companies || [];

                const activities = [
                    ...jobs.map(job => ({
                        type: 'job',
                        message: `You posted a new job: "${job.title}"`,
                        date: new Date(job.createdAt)
                    })),
                    ...companies.map(company => ({
                        type: 'company',
                        message: `You registered a new company: "${company.name}"`,
                        date: new Date(company.createdAt)
                    }))
                ];

                activities.sort((a, b) => b.date - a.date);
                fetchRecentActivities(activities.slice(0, 5)); // Get the 5 most recent activities
            } catch (error) {
                console.error('Error fetching recent activities:', error);
            }
        };

        fetchRecentActivities();
    }, []);

    const loading = jobsLoading || setUsers;

    useEffect(() => {
        if (!loading && (!allJobs || !companies || !users)) {
            toast.error('Failed to load some dashboard data');
        }
    }, [loading, allJobs, companies, users]);

    const dashboardItems = [
        { title: 'Users', icon: FaUsers, count: users?.length || 0, color: 'bg-pink-500' },
        { title: 'Jobs', icon: FaBriefcase, count: allJobs?.length || 0, color: 'bg-blue-500' },
        { title: 'Companies', icon: FaBuilding, count: companies?.length || 0, color: 'bg-purple-500' },
    ];

    // Prepare data for the chart
    const chartData = {
        labels: ['Users', 'Jobs', 'Companies'],
        datasets: [
            {
                label: 'Count',
                data: [users?.length || 0, allJobs?.length || 0, companies?.length || 0],
                backgroundColor: ['#ec4899', '#3b82f6', '#8b5cf6'],
                borderColor: ['#db2777', '#2563eb', '#7c3aed'],
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Admin Dashboard Overview' }
        }
    };

    useEffect(() => {
        // Listen for real-time updates
        socket.on('jobCreated', (newJob) => {
            dispatch(setJobs([...allJobs, newJob]));
        });

        // Cleanup on component unmount
        return () => {
            socket.off('jobCreated');
        };
    }, [allJobs, dispatch]);

    return (
        <div className='relative min-h-screen flex flex-col'>
            <RetroGrid className="absolute inset-0 z-0 w-full h-full" />
            <div className="relative z-10 flex-grow p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-indigo-900 mb-8">Welcome back, {user?.fullname}!</h1>

                    {loading ? (
                        <div className="text-center text-2xl text-indigo-600">Loading dashboard data...</div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {dashboardItems.map((item, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
                                        <div className={`p-4 ${item.color}`}>
                                            <item.icon className="text-white text-3xl" />
                                        </div>
                                        <div className="p-4">
                                            <h2 className="text-xl font-semibold text-gray-800">{item.title}</h2>
                                            <p className="text-3xl font-bold text-gray-600 mt-2">{item.count}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Chart for users, jobs, and companies */}
                            <div className="mt-10 bg-white bg-opacity-80 rounded-xl shadow-lg p-6">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminHome;
