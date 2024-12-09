"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useCreateAdminMutation } from "@/redux/service/admin";
import { useToast } from "@/hooks/use-toast";

type CreateAdminModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  userName: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(
      8,
      "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number"
    )
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

export function CreateAdminModal({ isOpen, onClose }: CreateAdminModalProps) {
  const { toast } = useToast();

  const [createAdmin] = useCreateAdminMutation();

  const handleSubmit = async (values: any) => {
    try {
      console.log("submit value", values);
      const response = await createAdmin({ data: values });

      console.log(response);

      if (response.data) {
        toast({
          description: "Comment liked successfully",
          variant: "success",
        });
      }
      onClose();
    } catch (error) {
      toast({
        description: "An error occurred. Please try again later.",
        variant: "error",
      });

      console.error(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto p-6">
        <DialogHeader className="text-center text-2xl font-semibold mb-2">
          <DialogTitle>Create New Admin</DialogTitle>
        </DialogHeader>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            userName: "",
            email: "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstname"
                    className="text-sm font-medium mb-2 block"
                  >
                    First Name
                  </label>
                  <Field
                    id="firstName"
                    name="firstName"
                    placeholder="Enter first name"
                    className="w-full rounded-lg p-4 text-sm"
                    as={Input}
                  />
                  <ErrorMessage
                    name="firstName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="text-sm font-medium mb-2 block"
                  >
                    Last Name
                  </label>
                  <Field
                    id="lastName"
                    name="lastName"
                    placeholder="Enter last name"
                    className="w-full rounded-lg p-4 text-sm"
                    as={Input}
                  />
                  <ErrorMessage
                    name="lastName"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="userName"
                  className="text-sm font-medium mb-2 block"
                >
                  Username
                </label>
                <Field
                  id="userName"
                  name="userName"
                  placeholder="Enter username"
                  className="w-full rounded-lg p-4 text-sm"
                  as={Input}
                />
                <ErrorMessage
                  name="userName"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium mb-2 block"
                >
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter email"
                  className="w-full rounded-lg p-4 text-sm"
                  as={Input}
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="text-sm font-medium mb-2 block"
                  >
                    Password
                  </label>
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password"
                    className="w-full rounded-lg p-4 text-sm"
                    as={Input}
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium mb-2 block"
                  >
                    Confirm Password
                  </label>
                  <Field
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    className="w-full rounded-lg p-4 text-sm"
                    as={Input}
                  />
                  <ErrorMessage
                    name="confirmPassword"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>
              </div>

              <DialogFooter className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Admin"}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
