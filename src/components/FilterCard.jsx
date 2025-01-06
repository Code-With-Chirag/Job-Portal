import React, { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, IndianRupee, X } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { useDispatch } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import ShineBorder from "./ui/shine-border";

const locations = ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"];
const jobRoles = ["Frontend Developer", "Backend Developer", "FullStack Developer"];

const FilterCard = () => {
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedJobRole, setSelectedJobRole] = useState("");
  const [salary, setSalary] = useState([0]);
  const dispatch = useDispatch();

  const handleLocationToggle = (loc) => {
    setSelectedLocation(prev => prev === loc ? "" : loc);
  };

  const handleJobRoleToggle = (role) => {
    setSelectedJobRole(prev => prev === role ? "" : role);
  };

  useEffect(() => {
    const searchQuery = {
      location: selectedLocation,
      jobRole: selectedJobRole,
      salary: salary[0]
    };
    dispatch(setSearchedQuery(searchQuery));
  }, [selectedLocation, selectedJobRole, salary, dispatch]);

  return (
    <ShineBorder borderRadius={10} borderWidth={2} color={["#8358F1", "#F25AE6", "#5B80F1"]} duration={10} className="w-full">
      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg w-full">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="relative">
            <Select
              value={selectedLocation}
              onValueChange={handleLocationToggle}
            >
              <SelectTrigger className="w-full">
                <MapPin className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedLocation && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSelectedLocation("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="relative">
            <Select
              value={selectedJobRole}
              onValueChange={handleJobRoleToggle}
            >
              <SelectTrigger className="w-full">
                <Briefcase className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Job Role" />
              </SelectTrigger>
              <SelectContent>
                {jobRoles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedJobRole && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full"
                onClick={() => setSelectedJobRole("")}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-gray-500 flex-shrink-0" />
            <Slider
              value={salary}
              onValueChange={setSalary}
              max={50}
              step={1}
              className="flex-grow"
            />
            <span className="text-sm font-medium w-[60px] flex-shrink-0">{salary[0]} LPA</span>
          </div>
        </div>
      </div>
    </ShineBorder>
  );
};

export default FilterCard;
