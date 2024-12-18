"use client";

import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useGetUserDetailQuery } from "@/redux/service/user";
import ParticlesComponent from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MyProfileComponent() {
  const [userUUID, setUserUUID] = useState("");
  const { data: userData } = useGetUserDetailQuery({ uuid: userUUID });
  // const [updateUserProfile] = useUpdateUserProfileMutation();

  useEffect(() => {
    setUserUUID(localStorage.getItem("userUUID") || "");
  }, []);

  const [initialValues, setInitialValues] = useState({
    firstName: "",
    lastName: "",
    name: "",
    bio: "",
    email: "",
  });

  useEffect(() => {
    if (userData?.data) {
      setInitialValues({
        firstName: userData.data.firstName || "",
        lastName: userData.data.lastName || "",
        name: userData.data.name || "",
        bio: userData.data.bio || "",
        email: userData.data.email || "",
      });
    }
  }, [userData]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: async () => {
      try {
        toast.success("Profile updated successfully!");
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Failed to update profile. Please try again.");
      }
    },
  });

  return (
    <div>
      {/* Toast Notification Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />

      {/* Section */}
      <section className="space-y-4 p-8">
        <div className="relative">
          <div className="absolute translate-x-0 rounded-md flex flex-col items-center h-44 w-full">
            <div className="absolute">
              <ParticlesComponent id="particles" />
            </div>
            <div className="absolute items-center justify-center my-36">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-primary">
                <img
                  className="w-full h-full object-cover"
                  src={userData?.data?.profile}
                  alt="profile"
                />
              </div>
              <p className="p-4 ml-5 cursor-pointer">Edit Photo</p>
            </div>
          </div>
        </div>

        <form
          onSubmit={formik.handleSubmit}
          className="bg-card flex flex-col justify-center items-stretch pt-80 gap-5 md:pt-80 pb-10 md:pb-5 px-10"
        >
          {/* First Name and Last Name */}
          <div className="grid grid-flow-col grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <p>First Name</p>
              <input
                type="text"
                name="firstName"
                className="border w-full p-3 rounded-lg"
                placeholder={userData?.data?.firstName || "Your FirstName"}
                value={formik.values.firstName}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>Last Name</p>
              <input
                type="text"
                name="lastName"
                className="border w-full p-3 rounded-lg"
                placeholder={userData?.data?.lastName || "Your Lastname"}
                value={formik.values.lastName}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          {/* Username and Email */}
          <div className="grid grid-flow-col grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <p>Username</p>
              <input
                type="text"
                name="name"
                className="border w-full p-3 rounded-lg"
                placeholder={userData?.data?.name || "Your Username"}
                value={formik.values.name}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <p>Email</p>
              <input
                name="email"
                className="border w-full p-3 rounded-lg"
                placeholder={userData?.data?.email || "Your email"}
                value={formik.values.email}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="grid grid-flow-col grid-cols-1 gap-5 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <p>Bio</p>
              <textarea
                name="bio"
                className="border w-full p-3 rounded-lg"
                placeholder={userData?.data?.bio || "Your bio"}
                value={formik.values.bio}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex md:justify-end gap-2 justify-center items-center">
            <Button variant="outline" type="button">
              Change Password
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </section>
    </div>
  );
}
