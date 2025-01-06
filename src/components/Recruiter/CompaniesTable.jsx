import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarImage } from "../ui/avatar";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "../ui/popover";
import { Edit2, MoreHorizontal, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { COMPANY_API_END_POINT } from "@/utils/constant";

const CompaniesTable = () => {
  const navigate = useNavigate();
  const { companies, searchCompanyByText } = useSelector((store) => store.company);
  const { user } = useSelector((store) => store.auth);
  const [filterCompany, setFilterCompany] = useState([]);

  useEffect(() => {
    const filteredCompany = companies.filter((company) => {
      // Filter by user ID
      const isUserCompany = company.userId === user._id;
      // Filter by search text
      const matchesSearch = !searchCompanyByText ||
        company.name.toLowerCase().includes(searchCompanyByText.toLowerCase());
      return isUserCompany && matchesSearch;
    });
    setFilterCompany(filteredCompany);
  }, [companies, searchCompanyByText, user._id]);

  const handleDelete = async (companyId) => {
    if (!window.confirm("Are you sure you want to delete this company?")) return;

    try {
      const response = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        timeout: 5000 // Set a timeout of 5 seconds
      });

      if (response.data.success) {
        toast.success("Company deleted successfully.");
        setFilterCompany(prev => prev.filter(company => company._id !== companyId));
      } else {
        throw new Error(response.data.message || "Failed to delete company");
      }
    } catch (error) {
      console.error('Error deleting company:', error);

      if (error.code === 'ECONNABORTED') {
        toast.error("Request timed out. Please try again.");
      } else if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        toast.error(error.response.data.message || "An error occurred while deleting the company.");
      } else if (error.request) {
        // The request was made but no response was received
        toast.error("No response received from server. Please check your connection and try again.");
      } else {
        // Something happened in setting up the request that triggered an Error
        toast.error("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (filterCompany.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No companies registered yet.</p>;
  }

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent registered companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCompany.map((company) => (
            <TableRow key={company._id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={company.logo} />
                </Avatar>
              </TableCell>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.createdAt.split("T")[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger>
                    <MoreHorizontal />
                  </PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div
                      onClick={() => navigate(`/admin/companies/${company._id}`)}
                      className="flex items-center gap-2 w-fit cursor-pointer"
                    >
                      <Edit2 className="w-4" />
                      <span>Update Company</span>
                    </div>
                    <div
                      onClick={() => handleDelete(company._id)}
                      className="flex items-center gap-2 w-fit cursor-pointer mt-2 text-red-600"
                    >
                      <Trash2 className="w-4" />
                      <span>Delete Company</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;
