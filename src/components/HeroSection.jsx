import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
import { FlipWords } from "./ui/flip-words";
import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";

const HeroSection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate(`/browse?query=${encodeURIComponent(query)}`);
  };

  const handleInputChange = (e) => {
    console.log(e.target.value);
  };

  const words = ["Dream Jobs", "Opportunities", "Career Growth", "Success"];
  const placeholders = [
    "Find your dream job",
    "Search for job titles",
    "Explore career opportunities",
    "Discover new roles",
  ];

  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10 max-w-4xl mx-auto">
        <span className="mx-auto px-6 py-3 rounded-full bg-[#6E28EE] bg-opacity-20 text-purple-100 font-medium text-sm md:text-base backdrop-blur-sm border border-purple-400 border-opacity-30">
          "Your Gateway to Career Success: Discover Your Next Opportunity Here"
        </span>
        <h1 className="text-4xl md:text-6xl font-bold leading-tight text-[#122c6f]">
          Search, Apply & <br /> Get Your{" "}
          <FlipWords words={words} className="text-[#6E28EE]" />
        </h1>
        <p>Dream as if you'll live forever. ...</p>
        <div className="w-full max-w-xl mx-auto">
          <PlaceholdersAndVanishInput
            placeholders={placeholders}
            onSubmit={searchJobHandler}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
