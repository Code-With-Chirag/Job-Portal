import React, { useState, useMemo } from "react";
import Navbar from "./Shared/Navbar";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Mail, Pen, Phone, Briefcase, MapPin, Search, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { Label } from "./ui/label";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const isResume = true;

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center space-x-4 bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
    <div className="bg-indigo-100 p-3 rounded-full">{icon}</div>
    <div>
      <span className="text-sm font-medium text-indigo-600">{label}</span>
      <p className="font-semibold text-gray-800">{value || 'Not specified'}</p>
    </div>
  </div>
);

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { allAppliedJobs } = useSelector(store => store.job);

  const activeAppliedJobs = useMemo(() => {
    return allAppliedJobs.filter(job => job.job && !job.job.isDeleted);
  }, [allAppliedJobs]);

  const isRecruiter = user?.role === 'Recruiter';

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-shrink-0 bg-gradient-to-br from-indigo-600 to-purple-700 p-10 flex flex-col items-center justify-center">
                <Avatar className="w-48 h-48 border-4 border-white shadow-xl">
                  <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname} />
                </Avatar>
                <h1 className="mt-6 text-3xl font-bold text-white">{user?.fullname}</h1>
                <Badge
                  variant="secondary"
                  className="mt-3 bg-white/20 text-white backdrop-blur-sm px-4 py-1 text-sm flex items-center space-x-2"
                >
                  <User className="w-4 h-4" />
                  <span>{user?.role}</span>
                </Badge>
              </div>
              <div className="p-10 flex-1">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
                  <Button onClick={() => setOpen(true)} variant="outline" className="flex items-center hover:bg-indigo-50 transition-colors duration-300">
                    <Pen className="mr-2 h-4 w-4" /> Edit Profile
                  </Button>
                </div>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">About</h3>
                    <p className="text-gray-600 bg-gray-50 p-5 rounded-xl shadow-inner">
                      {user?.profile?.bio || 'No bio available'}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem icon={<Mail className="w-6 h-6 text-indigo-600" />} label="Email" value={user?.email} />
                    <InfoItem icon={<Phone className="w-6 h-6 text-indigo-600" />} label="Phone" value={user?.phoneNumber} />
                    {isRecruiter && (
                      <>
                        <InfoItem icon={<Briefcase className="w-6 h-6 text-indigo-600" />} label="Company" value={user?.profile?.Company} />
                        <InfoItem icon={<MapPin className="w-6 h-6 text-indigo-600" />} label="Location" value={user?.profile?.Location} />
                      </>
                    )}
                  </div>
                  {!isRecruiter && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-700 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {user?.profile?.skills?.length ? (
                          user?.profile?.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-800 px-3 py-1">
                              {skill}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-gray-600">No skills listed</span>
                        )}
                      </div>
                    </div>
                  )}
                  {!isRecruiter && (
                    <div>
                      <Label className="text-lg font-semibold text-gray-700">Resume</Label>
                      {isResume ? (
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          href={user?.profile?.Resume}
                          className="ml-2 text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-300"
                        >
                          {user?.profile?.resumeOriginalName}
                        </a>
                      ) : (
                        <span className="ml-2 text-gray-600">Not available</span>
                      )}
                    </div>
                  )}
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

export default Profile;
