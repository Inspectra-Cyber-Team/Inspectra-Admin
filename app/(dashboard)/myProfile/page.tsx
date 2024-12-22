"use client";

import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import {
  useGetUserDetailQuery,
  useUpdateUserProfileMutation,
} from "@/redux/service/user";
import ParticlesComponent from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import "react-toastify/dist/ReactToastify.css";
import ChangePasswordComponent from "@/components/Auth/ChangPasswordComponent";
import { useToast } from "@/hooks/use-toast";
import { useUploadFileMutation } from "@/redux/service/fileupload";

type FormValues = {
  profile: string; // This should be a string (URL) instead of a File[]
  name: string;
  bio: string;
};

export default function MyProfileComponent() {
  const [userUUID, setUserUUID] = useState("");

  const { toast } = useToast();

  const { data: userData } = useGetUserDetailQuery({ uuid: userUUID });

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const [updateUserProfile] = useUpdateUserProfileMutation();

  const handleUpdateProfile = async (values: FormValues) => {
    try {
      await updateUserProfile({ userProfile: values }).unwrap();
      toast({
        description: "Profile updated successfully!",
        variant: "success",
      });
    } catch {
      toast({
        description: "Failed to update profile. Please try again.",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    setUserUUID(localStorage.getItem("userUUID") || "");
  }, []);

  const [initialValues, setInitialValues] = useState<FormValues>({
    name: "",
    bio: "",
    profile: "", // Initialize as an empty string
  });

  useEffect(() => {
    if (userData?.data) {
      setInitialValues({
        name: userData.data.name || "",
        bio: userData.data.bio || "",
        profile: userData.data.profile || "", // Set the string value (URL)
      });
    }
  }, [userData]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      const updatedValues = {
        ...values,
        profile: previewImage || values.profile,
      };

      try {
        await handleUpdateProfile(updatedValues);
      } catch {
        toast({
          description: "Failed to update profile. Please try again.",
          variant: "error",
        });
      }
    },
  });

  const [previewImage, setPreviewImage] = useState<string>("");

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      // Upload the file and get the URL
      const fileUrl = await handleFileUpload(file);

      if (fileUrl) {
        // Set the URL as the profile value in Formik
        setFieldValue("profile", fileUrl);

        // Optionally, set the preview image to the uploaded file URL
        setPreviewImage(fileUrl);
      }
    }
  };

  const [uploadFile] = useUploadFileMutation();

  const handleFileUpload = async (file: any) => {
    const formData = new FormData();

    formData.append("file", file);

    try {
      const response = await uploadFile({ file: formData }).unwrap();

      // Check the response structure to ensure `fullUrl` exists
      if (response?.data?.fullUrl) {
        return response.data.fullUrl; // Return the full URL
      } else {
        toast({
          description: "Failed to upload file. Please try again.",
          variant: "error",
        });
        return ""; // Return an empty string in case of failure
      }
    } catch {
      toast({
        description: "Failed to upload file. Please try again.",
        variant: "error",
      });
      return ""; // Return an empty string if an error occurs
    }
  };

  return (
    <div>
      <section className="space-y-4 p-8">
        <div className="relative">
          <div className="absolute translate-x-0 rounded-md flex flex-col items-center h-44 w-full">
            <div className="absolute">
              <ParticlesComponent id="particles" />
            </div>
            <div className="absolute items-center justify-center my-36">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-primary relative group">
                <img
                  className="w-full h-full object-cover"
                  src={previewImage || userData?.data?.profile || null}
                  alt="profile"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label htmlFor="profile-upload" className="cursor-pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, formik.setFieldValue)}
                  />
                </div>
              </div>
              <p className="text-center">{userData?.data?.name}</p>
              <p className="text-center">{userData?.data?.email}</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="bg-card flex flex-col justify-center items-stretch pt-80 gap-5 md:pt-[360px] pb-10 md:pb-5 px-10"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <p className="md:w-[35%]">Username</p>
            <input
              type="text"
              name="name"
              className="border border-text_color_desc_light text-text_color_desc_light w-full p-3 rounded-lg"
              placeholder={userData?.data?.name || "Your Username"}
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="md:w-[35%] flex flex-col">
              <p>Bio</p>
              <p className="text-text_color_desc_light dark:text-text_color_desc_dark hidden md:block">
                Write a short introduction about yourself
              </p>
            </div>
            <textarea
              name="bio"
              className="border border-text_color_desc_light text-text_color_desc_light w-full p-3 rounded-lg"
              placeholder={userData?.data?.bio || "Add a short bio..."}
              value={formik.values.bio}
              onChange={formik.handleChange}
            />
          </div>

          {/* Buttons */}
          <div className="flex md:justify-end gap-2 justify-center items-center">
            <Button
              className="hover:bg-primary hover:text-black"
              onClick={() => setIsChangePasswordOpen(true)}
              variant="outline"
              type="button"
            >
              Change Password
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>

        <ChangePasswordComponent
          isOpen={isChangePasswordOpen}
          onClose={() => setIsChangePasswordOpen(false)}
        />
      </section>
    </div>
  );
}
