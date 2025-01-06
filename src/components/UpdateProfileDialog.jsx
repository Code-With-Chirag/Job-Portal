import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import Cropper from 'react-easy-crop';

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    company: user?.profile?.Company || "",
    location: user?.profile?.Location || "",
    experience: user?.profile?.Experience || "",
    skills: user?.profile?.skills?.join(", ") || "",
    currentPassword: "",
    newPassword: "",
    file: null,
    profilePhoto: null,
  });

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        bio: user.profile?.bio || "",
        company: user.profile?.Company || "",
        location: user?.profile?.Location || "",
        experience: user.profile?.Experience || "",
        skills: user.profile?.skills?.join(", ") || "",
        currentPassword: "",
        newPassword: "",
        file: null,
        profilePhoto: null,
      });
    }
  }, [user]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.setAttribute('crossOrigin', 'anonymous');
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg');
    });
  };

  const handleCropImage = async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(
        URL.createObjectURL(input.profilePhoto),
        croppedAreaPixels
      );
      setCroppedImage(croppedImage);
    }
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setInput({ ...input, [e.target.name]: file });
      setCroppedImage(null);
    } else {
      setInput({ ...input, [e.target.name]: file });
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);

    if (user.role === "Recruiter") {
      formData.append("company", input.company);
      formData.append("location", input.location);
      formData.append("experience", input.experience);
    } else if (user.role !== "Admin") {
      formData.append("skills", input.skills);
      if (input.file) {
        formData.append("file", input.file);
      }
    }

    if (croppedImage) {
      formData.append("profilePhoto", croppedImage, "cropped_profile_photo.jpg");
    } else if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }

    // Append password fields if they are provided
    if (input.currentPassword) {
      formData.append("currentPassword", input.currentPassword);
    }
    if (input.newPassword) {
      formData.append("newPassword", input.newPassword);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedUser = res.data.user;
        dispatch(setUser(updatedUser));

        // Update local state to reflect changes
        setInput(prevInput => ({
          ...prevInput,
          fullname: updatedUser.fullname || "",
          email: updatedUser.email || "",
          phoneNumber: updatedUser.phoneNumber || "",
          bio: updatedUser.profile?.bio || "",
          company: updatedUser.profile?.Company || "",
          location: updatedUser.profile?.Location || "",
          experience: updatedUser.profile?.Experience || "",
          skills: updatedUser.profile?.skills?.join(", ") || "",
        }));

        toast.success(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "An error occurred while updating the profile");
    } finally {
      setLoading(false);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center">Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler} className="space-y-4">
          {/* Common fields for all users */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="fullname" className="text-right">Name</Label>
              <Input
                id="fullname"
                name="fullname"
                value={input.fullname}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bio" className="text-right">Bio</Label>
              <Input
                id="bio"
                name="bio"
                value={input.bio}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>
          </div>

          {/* Recruiter-specific fields */}
          {user.role === 'Recruiter' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">Company</Label>
                <Input
                  id="company"
                  name="company"
                  value={input.company}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={input.location}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="experience" className="text-right">Experience</Label>
                <Input
                  id="experience"
                  name="experience"
                  type="number"
                  value={input.experience}
                  onChange={changeEventHandler}
                  className="col-span-3"
                  min="0"
                />
              </div>
            </div>
          )}

          {/* Job seeker-specific fields */}
          {user.role !== 'Recruiter' && user.role !== 'Admin' && (
            <div className="space-y-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="skills" className="text-right">Skills</Label>
                <Input
                  id="skills"
                  name="skills"
                  value={input.skills}
                  onChange={changeEventHandler}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="file" className="text-right">Resume</Label>
                <Input
                  id="file"
                  name="file"
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="col-span-3"
                />
              </div>
            </div>
          )}

          {/* Profile photo upload and cropping for all users */}
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="profilePhoto" className="text-right">Profile Photo</Label>
              <Input
                id="profilePhoto"
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={fileChangeHandler}
                className="col-span-3"
              />
            </div>
            {input.profilePhoto && !croppedImage && (
              <div className="mt-4 h-64 relative">
                <Cropper
                  image={URL.createObjectURL(input.profilePhoto)}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
            )}
            {input.profilePhoto && !croppedImage && (
              <Button type="button" onClick={handleCropImage} className="w-full">
                Crop Image
              </Button>
            )}
            {croppedImage && (
              <div className="mt-4">
                <img src={URL.createObjectURL(croppedImage)} alt="Cropped" className="max-w-full h-auto" />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 h-5 w-5" />
                  <span>Updating...</span>
                </div>
              ) : (
                <span>Save Changes</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
