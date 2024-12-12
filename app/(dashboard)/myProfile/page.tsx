"use client";

// import { useRouter } from "next/navigation";
import { useFormik } from "formik";
// import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { useGetUserDetailQuery } from "@/redux/service/user";
import { useUpdateUserProfileMutation } from "@/redux/service/user";
import ParticlesComponent from "@/components/ParticleBackground";
import { Button } from "@/components/ui/button";

export default function MyProfileComponent() {
  // const router = useRouter();
  const [userUUID, setUserUUID] = useState("");
  const { data: userData } = useGetUserDetailQuery({ uuid: userUUID });
  const [updateUserProfile] = useUpdateUserProfileMutation();

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
    enableReinitialize: true, // Important to enable reinitialization when values change
    onSubmit: (values) => {
      updateUserProfile({ userProfile: values });
    },
  });
  

  return (
    <div>
      {/* section */}
      <section className="space-y-4 p-8">
        <div className="relative">
          <div className="absolute translate-x-0 rounded-md flex flex-col items-center h-44 w-full">
            <div className="absolute">
              <ParticlesComponent id="particles" />
            </div>
           <div className="absolute items-center my-36">
           <div className="w-36 h-36 rounded-full overflow-hidden">
              <img
                className="w-full h-full object-cover"
                src={userData?.data?.profile}
                alt="profile"
              />
             
            </div>
           </div>
          </div>

        </div>

          <form
            onSubmit={formik.handleSubmit}
            className=" flex flex-col gap-5 md:pt-80 pb-10 md:pb-5 px-10 bg-card"
          >

            {/* First Name and last Name */}
            <div className="grid grid-flow-col grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <p>First Name</p>
              <input
                type="text"
                name="name"
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
                name="name"
                className="border w-full p-3 rounded-lg"
                placeholder={userData?.data?.lastName || "Your Username"}
                value={formik.values.lastName}
                onChange={formik.handleChange}
              />
            </div>
            </div>

            {/* Username and Bio */}
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

            {/*  Bio */}
            <div className="grid grid-flow-col grid-cols-2 gap-5">
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
            {/* Button Save */}
            <div className="flex md:justify-end gap-2">
            <Button
            variant="outline"
                type="submit"
              >
                Change Password
              </Button>
              <Button
                type="submit"
              >
                Save Changes
              </Button>
            </div>
          </form>
      </section>
    </div>
  );
}