import React, { useState } from "react";
import Navbar from "../Shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { COMPANY_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setCompanies, setSingleCompany } from "@/redux/companySlice";
import axios from "axios";

const CompanyCreate = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies } = useSelector((store) => store.company);
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  const validateCompanyName = (name) => {
    if (!name.trim()) {
      return "Company name is required.";
    }
    if (name.length < 3) {
      return "Company name must be at least 3 characters long.";
    }
    return "";
  };

  const handleCompanyNameChange = (e) => {
    const name = e.target.value;
    setCompanyName(name);
    if (touched) {
      const validationError = validateCompanyName(name);
      setError(validationError);
    }
  };

  const handleBlur = () => {
    setTouched(true);
    const validationError = validateCompanyName(companyName);
    setError(validationError);
  };

  const registerNewCompany = async () => {
    if (error) return;

    try {
      const res = await axios.post(
        `${COMPANY_API_END_POINT}/register`,
        { companyName },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      // console.log('API Response:', res.data);
      if (res?.data?.success) {
        const newCompany = res.data.company;
        // Update the list of companies in Redux
        dispatch(setCompanies([...companies, newCompany]));
        dispatch(setSingleCompany(newCompany));
        // dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto">
        <div className="my-10">
          <h1 className="font-bold text-2xl">Your Company Name</h1>
          <p className="text-gray-500">
            Give Name For Your Company. You can change this later.
          </p>
        </div>

        <Label>Company Name</Label>
        <Input
          type="text"
          className="my-2"
          placeholder="Your Company Name."
          value={companyName}
          onChange={handleCompanyNameChange}
          onBlur={handleBlur} // Trigger validation display when the input loses focus
        />
        {touched && error && <p className="text-red-500">{error}</p>}

        <div className="flex items-center gap-2 my-10">
          <Button variant="outline" onClick={() => navigate("/admin/companies")}>
            Cancel
          </Button>
          <Button
            onClick={registerNewCompany}
            disabled={!!error || !companyName.trim()}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;

