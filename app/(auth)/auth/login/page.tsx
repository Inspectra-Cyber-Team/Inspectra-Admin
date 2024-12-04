"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { IoEyeOffSharp } from "react-icons/io5";
import { IoEyeSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import ParticlesComponent from "@/components/ParticleBackground";
import Link from "next/link"
import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card"

type FormValues = {
  email: string;
  password: string;
};

const LogIn = () => {
  //create route
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  //handle show password when clicked icon
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
    // Toggle password visibility
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email address").required("Required"),
    password: Yup.string().required("Password is Required"),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL_LOCALHOST}login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      );

      if (res.status === 200) {
        const data = await res.json();
        console.log(data);
        setIsSubmitting(false);
        router.push("/");
      } else {
        setIsSubmitting(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
       <div className="h-screen flex flex-wrap justify-center items-center p-4 bg-black">
       <ParticlesComponent id="particles"/>
  {/* Card Component */}
  <Card className="bg-white drop-shadow-lg w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
    <CardTitle className="text-center text-2xl font-semibold text-gray-800">
      Login to your account
    </CardTitle>
    <CardDescription className="text-center text-gray-500 mt-2">
      Please enter your details to proceed.
    </CardDescription>
    {isSubmitting && (
      <p className="text-center text-sm mt-4 text-green-500">Processing...</p>
    )}

    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting }) => (
        <Form className="grid gap-6 mt-6">
          {/* Email Field */}
          <div className="grid gap-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <Field
              className="w-full rounded-lg border border-gray-300 p-4 text-sm shadow-sm focus:border-primary focus:ring focus:ring-primary bg-gray-50"
              name="email"
              placeholder="Enter your email"
              type="email"
            />
            <ErrorMessage
              className="text-red-500 text-sm mt-1"
              component="div"
              name="email"
            />
          </div>

          {/* Password Field */}
          <div className="grid gap-2 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <Field
              className="w-full rounded-lg border border-gray-300 p-4 text-sm shadow-sm focus:border-primary focus:ring focus:ring-primary bg-gray-50"
              name="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
            />
            {!showPassword ? (
              <IoEyeOffSharp
                className="cursor-pointer absolute right-4 top-[42px] text-gray-500"
                onClick={() => handleShowPassword()}
                size={20}
              />
            ) : (
              <IoEyeSharp
                className="cursor-pointer absolute right-4 top-[42px] text-gray-500"
                onClick={() => handleShowPassword()}
                size={20}
              />
            )}
            <ErrorMessage
              className="text-red-500 text-sm mt-1"
              component="div"
              name="password"
            />
            <Link
              href="#"
              className="text-sm text-blue-500 underline mt-2 text-right"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            className="inline-block w-full rounded-lg px-5 py-3 text-sm font-medium bg-primary "
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </Form>
      )}
    </Formik>
  </Card>
</div>

    </section>
    
  );
};

export default LogIn;
