import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSearchedQuery } from "@/redux/jobSlice";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Marquee from "./ui/marquee";

const categories = [
  "Frontend Developer",
  "Backend Developer",
  "Data Scientist",
  "Mobile Developer",
  "Graphic Designer",
  "Full Stack Developer",
  "Product Manager",
  "UX/UI Designer",
  "QA Engineer",
  "DevOps Engineer",
  "Cyber Security Specialist",
  "Game Developer",
  "HULK"
];

const CategoryButton = ({ category, onClick }) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      className={cn(
        "mx-3 rounded-full whitespace-nowrap px-5 py-2 text-sm transition-all duration-300 ease-in-out",
        "border-purple-300 bg-purple-100 text-[#122c6f]",
        "hover:bg-purple-200 hover:text-purple-900 hover:border-purple-400",
        "hover:scale-105 shadow-sm hover:shadow-md",
        "dark:border-purple-700 dark:bg-purple-900 dark:text-purple-200",
        "dark:hover:bg-purple-800 dark:hover:text-purple-100 dark:hover:border-purple-600"
      )}
    >
      {category}
    </Button>
  );
};

const CategoryCarousel = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchJobHandler = (query) => {
    dispatch(setSearchedQuery(query));
    navigate(`/browse?query=${encodeURIComponent(query)}`);
  };

  return (
    <div className="relative py-8 w-full overflow-hidden bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900 dark:to-indigo-900">
      <Marquee pauseOnHover className="[--duration:40s]">
        {categories.map((category, index) => (
          <CategoryButton
            key={index}
            category={category}
            onClick={() => searchJobHandler(category)}
          />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-purple-100 dark:from-purple-900"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-indigo-100 dark:from-indigo-900"></div>
    </div>
  );
};

export default CategoryCarousel;
