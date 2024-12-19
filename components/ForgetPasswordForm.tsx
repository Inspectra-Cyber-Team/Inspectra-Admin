"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import * as Yup from "yup";
import ParticlesComponent from "./ParticleBackground";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useRequestPasswordResetMutation, useResetPasswordMutation } from "@/redux/service/auth";
import { useToast } from "@/hooks/use-toast";
import { IoEyeOffSharp, IoEyeSharp } from "react-icons/io5";

type OtpType = {
  otp1: string;
  otp2: string;
  otp3: string;
  otp4: string;
  otp5: string;
  otp6: string;
};

const initialOtpValues: OtpType = {
  otp1: "",
  otp2: "",
  otp3: "",
  otp4: "",
  otp5: "",
  otp6: "",
};

const otpValidationSchema = Yup.object({
  otp1: Yup.string().required("OTP 1 is required"),
  otp2: Yup.string().required("OTP 2 is required"),
  otp3: Yup.string().required("OTP 3 is required"),
  otp4: Yup.string().required("OTP 4 is required"),
  otp5: Yup.string().required("OTP 5 is required"),
  otp6: Yup.string().required("OTP 6 is required"),
});

const emailValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

type Email = {
  email: string;
};

const initialEmailValues: Email = {
  email: "",
};

const validationSchema = Yup.object({
  newPassword: Yup.string()
    .required("New Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function ForgetPassowrdForm() {
  const router = useRouter();

  const { toast } = useToast();

  const [requestPasswordReset] = useRequestPasswordResetMutation();

  const [resetPassword] = useResetPasswordMutation();

  const [openModal, setOpenModal] = useState(false);

  const [openModalPassword, setOpenModalPassword] = useState(false);

  const [opt, setOpt] = useState("");

  const [email, setEmail] = useState("");

  const handleSubmitOpt = (values: any) => {
    const otpString = `${values.otp1}${values.otp2}${values.otp3}${values.otp4}${values.otp5}${values.otp6}`;

    setOpt(otpString);

    if (otpString.length === 6) {
      setOpenModalPassword(true);
    }
    // Close the modal
    setOpenModal(false);
  };

  const handleSubmit = (value: Email) => {
   
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword1, setShowPassword1] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleShowPassword1 = () => {
    setShowPassword1(!showPassword1);
  };

  const handleRequestPasswordReset = async (email: string) => {
    try {

      setEmail(email);

      const response = await requestPasswordReset({ email });

      if (response.data) {
        toast({
          description: "OTP sent to your email successfully!",
          variant: "success",
        });
        setOpenModal(true);
      } else {
        toast ({
          description: "Failed to send OTP. Please try again!",
          variant: "error",
        })
      }
    } catch  {
      toast ({
        description: "Failed to send OTP. Please try again!",
        variant: "error",
      })
    }
  }

  // handle submit change password
  const handleSubmitchangePassword = async (values: any) => {
    try {
      const response = await resetPassword({
        data: {
          email: email,
          otp: opt,
          newPassword: values.newPassword,
          confirmPassword: values.confirmPassword,
        },
      });

      if (response.data) {
        toast({
          description: "Password changed successfully!",
          variant: "success",
        });
        setOpenModalPassword(false);
        router.push("/auth/login");
      } else {
        toast({
          description: "Failed to change password. Please try again!",
          variant: "error",
        });
      }
    } catch  {
      toast({
        description: "Failed to change password. Please try again!",
        variant: "error",
      });
    }
  };

  return (
    <section>
      <div className="h-screen  flex flex-wrap justify-center items-center p-4 bg-black">
        <ParticlesComponent id="particles" />
        {/* Card Component */}
        <Card className="drop-shadow-lg w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
          <div className="flex justify-between">
            <CardTitle className="text-2xl font-semibold text-card-foreground">
              Forget Password
            </CardTitle>
            {/* Close icon */}
            <Link href={"/"}>
              <RxCross2 />
            </Link>
          </div>
          <CardDescription className="mt-2 text-[#888888]">
            Enter your email for the verification process, we will send 6 digits
            code to your email.
          </CardDescription>

          {/* form for input email */}
          <Formik
            initialValues={initialEmailValues}
            validationSchema={emailValidationSchema}
            onSubmit={async (values) => {
              await handleRequestPasswordReset(values.email);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="grid gap-6 mt-6">
                {/* Email Field */}
                <div className="grid gap-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <Field
                    className="w-full rounded-lg border p-4 text-sm"
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

                {/* Submit Button */}
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="inline-block w-full rounded-lg px-5 py-3 text-sm font-medium bg-primary text-primary-foreground"
                
                >
                  {isSubmitting ? (
                    <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-t-2 border-primary-foreground border-t-transparent"></div>
                  ) : (
                    "Verify Email"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </Card>
      </div>

      {/* Modal for OTP Input */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit rounded-xl">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <Formik
            initialValues={initialOtpValues}
            validationSchema={otpValidationSchema}
            onSubmit={(values) => {
              handleSubmitOpt(values);

              // Handle OTP verification here
            }}
          >
            {({ values, handleChange }) => (
              <Form>
                <div className="flex justify-between m-5">
                  {Array.from({ length: 6 }, (_, index) => {
                    const fieldName = `otp${index + 1}` as keyof OtpType;
                    return (
                      <Field
                        key={index}
                        type="text"
                        id={fieldName}
                        name={fieldName}
                        maxLength={1}
                        value={values[fieldName]} // Ensures value is controlled
                        onChange={handleChange}
                        onKeyDown={(e: {
                          key: string;
                          target: { value: any };
                        }) => {
                          if (e.key === "Backspace") {
                            const value = e.target.value;
                            if (!value && index > 0) {
                              const prevField = document.getElementById(
                                `otp${index}`
                              );
                              if (prevField) {
                                prevField.focus();
                              }
                            }
                          }
                        }}
                        className="h-[40px] w-[40px] md:w-[60px] md:h-[60px] border focus:right-2 border-text_color_desc_light rounded-md text-center text-text_body_16"
                        placeholder="_"
                      />
                    );
                  })}
                </div>
                <Button className="w-full" type="submit" variant={"default"}>
                  Verify
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/* modal chnage password */}
      <Dialog open={openModalPassword} onOpenChange={setOpenModalPassword}>
        <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit rounded-xl">
          <DialogHeader>
            <DialogTitle>Forgot Password</DialogTitle>
          </DialogHeader>
          {/* form for input email */}
          <Formik
            initialValues={{
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (Values) => {
               await handleSubmitchangePassword(Values);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="grid gap-6 mt-6 ">
                {/* New Password */}
                <div className="grid gap-2 relative">
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium "
                  >
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    className="w-full rounded-lg border p-4 text-sm"
                    name="newPassword"
                    placeholder="Enter your new password"
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
                    name="newPassword"
                  />
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2 relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium "
                  >
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    className="w-full rounded-lg border p-4 text-sm"
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    type={showPassword1 ? "text" : "password"}
                  />
                  {!showPassword1 ? (
                    <IoEyeOffSharp
                      className="cursor-pointer absolute right-4 top-[42px] text-gray-500"
                      onClick={() => handleShowPassword1()}
                      size={20}
                    />
                  ) : (
                    <IoEyeSharp
                      className="cursor-pointer absolute right-4 top-[42px] text-gray-500"
                      onClick={() => handleShowPassword1()}
                      size={20}
                    />
                  )}
                  <ErrorMessage
                    className="text-red-500 text-sm mt-1"
                    component="div"
                    name="confirmPassword"
                  />
                </div>

                {/* Submit Button */}
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="inline-block w-full rounded-lg px-5 py-3 text-sm font-medium bg-primary text-primary-foreground "
                >
                  {isSubmitting ? (
                    <div className=" spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-t-2 border-primary-foreground border-t-transparent"></div>
                  ) : (
                    "Submit"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </section>
  );
}
