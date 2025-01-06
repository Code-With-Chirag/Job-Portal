import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Mail, Phone, Briefcase, MapPin, Pen, Building, Calendar } from 'lucide-react';
import Navbar from './Shared/Navbar';
import { Button } from './ui/button';
import UpdateProfileDialog from './UpdateProfileDialog';

const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
        <div className="bg-indigo-100 p-2 rounded-full">{icon}</div>
        <div>
            <span className="text-sm text-gray-500">{label}</span>
            <p className="font-semibold text-gray-800">{value || 'Not specified'}</p>
        </div>
    </div>
);

const ViewProfile = () => {
    const { user } = useSelector((store) => store.auth);
    const [open, setOpen] = useState(false);

    if (!user) {
        return <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>;
    }

    if (user.role !== 'Recruiter') {
        return <div className="flex items-center justify-center h-screen text-2xl text-red-600">Access Denied. This page is for recruiters only.</div>;
    }

    return (
        <>
            <Navbar />
            <div className="bg-gradient-to-br from-indigo-50 to-blue-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
                        <div className="md:flex">
                            <div className="md:flex-shrink-0 bg-gradient-to-br from-[#8358F1] to-[#5B80F1] p-8 flex flex-col items-center justify-center">
                                <Avatar className="w-40 h-40 border-4 border-white shadow-lg">
                                    <AvatarImage src={user.profile?.profilePhoto} alt={user.fullname} />
                                </Avatar>
                                <h1 className="mt-6 text-3xl font-bold text-white">{user.fullname}</h1>
                                <Badge variant="secondary" className="mt-3 bg-white/20 text-white backdrop-blur-sm px-4 py-1">
                                    <Briefcase className="w-4 h-4 mr-2" /> {user.role}
                                </Badge>
                            </div>
                            <div className="p-8 flex-1">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-3xl font-semibold text-gray-800">Recruiter Profile</h2>
                                    <Button onClick={() => setOpen(true)} variant="outline" className="flex items-center hover:bg-indigo-50">
                                        <Pen className="mr-2 h-4 w-4" /> Edit Profile
                                    </Button>
                                </div>
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-700 mb-3">About</h3>
                                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg leading-relaxed">{user.profile?.bio || 'No bio available'}</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InfoItem icon={<Mail className="w-5 h-5 text-indigo-600" />} label="Email" value={user.email} />
                                        <InfoItem icon={<Phone className="w-5 h-5 text-indigo-600" />} label="Phone" value={user.phoneNumber} />
                                        <InfoItem icon={<Building className="w-5 h-5 text-indigo-600" />} label="Company" value={user.profile?.company} />
                                        <InfoItem icon={<MapPin className="w-5 h-5 text-indigo-600" />} label="Location" value={user.profile?.location} />
                                        <InfoItem icon={<Calendar className="w-5 h-5 text-indigo-600" />} label="Experience" value={`${user.profile?.experience || 0} years`} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </>
    );
};

export default ViewProfile;
