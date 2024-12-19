"use client";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useChnagePasswordMutation } from "@/redux/service/auth";
import { useToast } from "@/hooks/use-toast";


const validationSchema = Yup.object({
  oldPassword: Yup.string().required("Old Password is required"),
  newPassword: Yup.string()
    .required("New Password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword"), undefined], "Passwords must match")
    .required("Confirm Password is required"),
});

type ChnagePassword = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type ChangePasswordProps = {
  readonly isOpen: boolean;
  readonly onClose: () => void;
};

export default function ChangePasswordComponent({
  isOpen,
  onClose,
}: ChangePasswordProps) {

  const [changePassword] = useChnagePasswordMutation();

  const {toast} = useToast();

  const handleChnagePassword = async (values: ChnagePassword) => {
    try {
 
      const response = await changePassword({ data:values });

      if (response.data) {
        toast({
          description: "Password changed successfully!",
          variant: "success",
        })
        onClose();
      }
      else {
        toast({
          description: "Failed to change password. Please try again.",
          variant: "error",
        })
       
      }
    } catch (error) {
      console.error("Failed to change password:", error);
      toast({
        description: "Failed to change password. Please try again.",
        variant: "error",
      });
    }
  };

  return (
    <section>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-card w-full max-w-[90%] md:max-w-md lg:max-w-lg mx-auto h-fit rounded-xl">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          {/* form for input email */}
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (Values) => {
              await handleChnagePassword(Values);
            }}
          >
            {({ isSubmitting }) => (
              <Form className="grid gap-6 mt-6 ">
                {/* Emial */}
                {/* Email Field */}
                <div className="grid gap-2">
                  <label
                    htmlFor="oldPassword"
                    className="block text-sm font-medium "
                  >
                    Password <span className="text-red-500">*</span>
                  </label>
                  <Field
                    className="w-full rounded-lg border p-4 text-sm"
                    name="oldPassword"
                    placeholder="Enter your old password"
                    type="password"
                  />

                  <ErrorMessage
                    className="text-red-500 text-sm mt-1"
                    component="div"
                    name="oldPassword"
                  />
                </div>

                {/* New Password */}
                <div className="grid gap-2">
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
                    type="password"
                  />
                  <ErrorMessage
                    className="text-red-500 text-sm mt-1"
                    component="div"
                    name="newPassword"
                  />
                </div>

                {/* Confirm Password */}
                <div className="grid gap-2">
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
                    type="password"
                  />
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
                    <div className="spinner-border animate-spin inline-block w-4 h-4 border-2 rounded-full border-t-2 border-primary-foreground border-t-transparent"></div>
                  ) : (
                    "Change Password"
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
