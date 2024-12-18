"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Link from "next/link";
import { RxCross2 } from "react-icons/rx";
import * as Yup from "yup";
import ParticlesComponent from "./ParticleBackground";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";

export default function ForgetPassowrdForm() {

  const router = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
  });

  type Email = {
    email: string;
  };

  const initialValues: Email = {
    email: "",
  };

  const handleSubmit = (value: Email) => {
    console.log(value);
    router.push("/verify");
  };

  return (
    <section>
      <div className="h-screen flex flex-wrap justify-center items-center p-4 bg-black">
        <ParticlesComponent id="particles" />
        {/* Card Component */}
        <Card className=" drop-shadow-lg w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit p-6 md:p-10 rounded-xl">
          <div className="flex justify-between">
            <CardTitle className="text-2xl font-semibold text-card-foreground">
              Forget Password
            </CardTitle>
            {/* Close icon */}
            <Link href={"/"}>
              <RxCross2 />
            </Link>
          </div>
          <CardDescription className=" mt-2 text-[#888888]">
            Enter your email for the verification process, we will send 6 digits
            code to your email.
          </CardDescription>

          {/* form for input email */}
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="grid gap-6 mt-6 ">
                {/* Emial */}
                {/* Email Field */}
                <div className="grid gap-2">
                  <label htmlFor="email" className="block text-sm font-medium ">
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
                  className="inline-block w-full rounded-lg px-5 py-3 text-sm font-medium bg-primary text-primary-foreground "
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
    </section>
  );
}
