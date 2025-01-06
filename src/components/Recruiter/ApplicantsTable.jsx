import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
    const { applicants } = useSelector(store => store.application);

    const statusHandler = async (status, id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    }

    const deleteHandler = async (id) => {
        try {
            axios.defaults.withCredentials = true;
            const res = await axios.delete(`${APPLICATION_API_END_POINT}/${id}/delete`);
            if (res.data.success) {
                toast.success("Applicant deleted successfully.");
                // Implement a function to refetch applicants or update the state
                // fetchAllApplicants();
            }
        } catch (error) {
            toast.error("Failed to delete applicant. Please try again.");
        }
    }

    // Filter out applicants with NA values
    const validApplicants = applicants?.applications?.filter(item =>
        item?.applicant?.fullname &&
        item?.applicant?.email &&
        item?.applicant?.phoneNumber
    ) || [];

    if (validApplicants.length === 0) {
        return <div className="text-center py-8">No valid applicants found.</div>;
    }

    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {validApplicants.map((item) => (
                        <TableRow key={item._id}>
                            <TableCell>{item.applicant.fullname}</TableCell>
                            <TableCell>{item.applicant.email}</TableCell>
                            <TableCell>{item.applicant.phoneNumber}</TableCell>
                            <TableCell>
                                {item.applicant?.profile?.Resume ? (
                                    <a
                                        className="text-blue-600 cursor-pointer"
                                        href={item.applicant.profile.Resume}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {item.applicant.profile.resumeOriginalName}
                                    </a>
                                ) : (
                                    <span>No Resume</span>
                                )}
                            </TableCell>
                            <TableCell>{new Date(item.applicant.createdAt).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                                <Popover>
                                    <PopoverTrigger>
                                        <MoreHorizontal className="cursor-pointer" />
                                    </PopoverTrigger>
                                    <PopoverContent className="w-32">
                                        {shortlistingStatus.map((status, index) => (
                                            <div
                                                onClick={() => statusHandler(status, item._id)}
                                                key={index}
                                                className='flex w-fit items-center my-2 cursor-pointer'
                                            >
                                                <span>{status}</span>
                                            </div>
                                        ))}
                                        <div
                                            onClick={() => deleteHandler(item._id)}
                                            className='flex w-fit items-center my-2 cursor-pointer text-red-600'
                                        >
                                            <Trash className='w-4 mr-2' />
                                            <span>Delete</span>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default ApplicantsTable;