import React from "react";
import { Button } from "./ui/button";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";

const Job = ({ job }) => {
  const navigate = useNavigate();
  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 24 * 60 * 60));
  }

  return (
    <div className="p-5 rounded-md bg-purple-50 border border-purple-200 shadow-sm flex flex-col h-[400px]">
      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">{daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}</p>
        </div>

        <div className="flex items-center gap-2 my-2">
          <Button className="p-6" variant="outline" size="icon">
            <Avatar>
              <AvatarImage src={job?.company?.logo} />
            </Avatar>
          </Button>
          <div>
            <h1 className="font-medium text-lg">{job?.company?.name}</h1>
            <p className="text-sm text-gray-500">{job?.location}</p>
          </div>
        </div>
        <div>
          <h1 className="font-bold text-lg my-2">{job?.title}</h1>
          <p className="text-sm text-gray-700 line-clamp-3">
            {job?.description}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <Badge className="bg-blue-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full text-xs font-medium" variant="ghost">
            {job?.position}
          </Badge>
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-xs font-medium" variant="ghost">
            {job?.jobType}
          </Badge>
          <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded-full text-xs font-medium" variant="ghost">
            {job?.salary}
          </Badge>
        </div>
      </div>
      <div className="mt-auto">
        <Button
          onClick={() => navigate(`/description/${job?._id}`)}
          variant="outline"
          className="bg-purple-400 hover:bg-[#dfb1fa] w-15"
        >
          Details
        </Button>
      </div>
    </div>
  );
};

export default Job;
