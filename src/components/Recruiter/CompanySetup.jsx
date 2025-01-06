import React, { useEffect, useState } from 'react';
import Navbar from '../Shared/Navbar';
import { Button } from '../ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import useGetCompanyById from '@/hooks/useGetCompanyById';

const CompanySetup = () => {
    const params = useParams();
    useGetCompanyById(params.id);
    const [input, setInput] = useState({
        name: "",
        description: "",
        website: "",
        location: "",
        file: null
    });
    const { singleCompany } = useSelector(store => store.company);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Validation logic
    const validate = () => {
        const newErrors = {};

        // Name validation
        if (!input.name.trim()) newErrors.name = "Company name is required.";
        if (input.name.length < 3) newErrors.name = "Company name must be at least 3 characters long.";
        if (input.name.length > 50) newErrors.name = "Company name cannot exceed 50 characters.";

        // Description validation
        if (input.description.length > 500) newErrors.description = "Description cannot exceed 500 characters.";

        // Website validation
        if (input.website && !/^(https?:\/\/)?(www\.)?([a-zA-Z0-9]+)\.[a-z]{2,}([a-zA-Z0-9/.]*)?$/.test(input.website)) {
            newErrors.website = "Please enter a valid website URL eg: https: or www.";
        }

        // Location validation
        if (input.location.length > 100) newErrors.location = "Location cannot exceed 100 characters.";

        // File validation (if needed)
        if (input.file) {
            const fileName = input.file.name;
            if (!/\.(jpg|jpeg|png|gif|svg)$/i.test(fileName)) {
                newErrors.file = "Logo must be a valid image file (jpg, jpeg, png, gif, svg).";
            }
        }

        return newErrors;
    };

    const handleChange = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
        if (touched[e.target.name]) {
            const newErrors = validate();
            setErrors(newErrors);
        }
    };

    const handleBlur = (e) => {
        setTouched({ ...touched, [e.target.name]: true });
        const newErrors = validate();
        setErrors(newErrors);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file });
        if (file) {
            const newErrors = validate();
            setErrors(newErrors);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        formData.append("website", input.website);
        formData.append("location", input.location);
        if (input.file) {
            formData.append("file", input.file);
        }
        try {
            setLoading(true);
            const res = await axios.put(`${COMPANY_API_END_POINT}/update/${params.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/companies");
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setInput({
            name: singleCompany.name || "",
            description: singleCompany.description || "",
            website: singleCompany.website || "",
            location: singleCompany.location || "",
            file: singleCompany.file || null
        });
    }, [singleCompany]);

    return (
        <div>
            <Navbar />
            <div className='max-w-xl mx-auto my-10'>
                <form onSubmit={handleSubmit}>
                    <div className='flex items-center gap-5 p-8'>
                        <Button onClick={() => navigate("/admin/companies")} variant="outline" className="flex items-center gap-2 text-gray-500 font-semibold">
                            <ArrowLeft />
                            <span>Back</span>
                        </Button>
                        <h1 className='font-bold text-xl'>Company Setup</h1>
                    </div>
                    
                    <div className='grid grid-cols-2 gap-4'>
                        <div>
                            <Label>Company Name</Label>
                            <Input
                                type="text"
                                name="name"
                                value={input.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${errors.name ? "border-red-500" : ""}`}
                            />
                            {touched.name && errors.name && <p className="text-red-500">{errors.name}</p>}
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type="text"
                                name="description"
                                value={input.description}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${errors.description ? "border-red-500" : ""}`}
                            />
                            {touched.description && errors.description && <p className="text-red-500">{errors.description}</p>}
                        </div>
                        <div>
                            <Label>Website</Label>
                            <Input
                                type="text"
                                name="website"
                                value={input.website}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${errors.website ? "border-red-500" : ""}`}
                            />
                            {touched.website && errors.website && <p className="text-red-500">{errors.website}</p>}
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type="text"
                                name="location"
                                value={input.location}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`${errors.location ? "border-red-500" : ""}`}
                            />
                            {touched.location && errors.location && <p className="text-red-500">{errors.location}</p>}
                        </div>
                        <div>
                            <Label>Logo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            {errors.file && <p className="text-red-500">{errors.file}</p>}
                        </div>
                    </div>           
                    {
                        loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                    }
                </form>
            </div>
        </div>
    )
}

export default CompanySetup;

