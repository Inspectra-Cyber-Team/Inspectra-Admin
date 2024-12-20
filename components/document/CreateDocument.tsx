"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import TextEditor from "@/components/TextEdittor/TextEditor";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {  useCreateDocumentMutation } from "@/redux/service/document";
import { useToast } from "@/components/hooks/use-toast";

const validationSchema = Yup.object().shape({

  documentCategoryName: Yup.string().required("Document Category Name is Required").
  trim("Document Category Name cannot contain only spaces").strict().min(1, "Document Category Name cannot be blank"),

  title: Yup.string()
    .required("Document title is Required")
    .trim("Document  title cannot contain only spaces")
    .strict()
    .min(1, "Document title cannot be blank"),

  description: Yup.string()
    .required("Description is Required")
    .trim("Description cannot contain only spaces")
    .strict()
    .min(1, "Description cannot be blank"),
});

export default function CreateDocument() {

  const { toast } = useToast();

  const router = useRouter();

  const [CreateDocumentCategory] = useCreateDocumentMutation();

  const handleCreateDocumentCategory = async (values: any) => {
    try {
        
      const res = await CreateDocumentCategory({ body: values }).unwrap();

        toast({
          description: "Document Created Successfully",
          variant: "success",
        });
        router.push("/document?tab=document");
      
    } catch (error: any) {

        console.log(error?.data?.error?.description )
        
      if (
       
        error?.data?.error?.code === "400 BAD_REQUEST" 
        // error?.data?.error?.description?.includes("Document Category already exists")
      ) {
        const existingName = error?.data?.error?.description.split(":")[1].trim();
        toast({
          description: `Document  with name "${existingName}" already exists`,
          variant: "error",
        });
      } else {
        toast({
          description: "Failed to create document category",
          variant: "error",
        });
      }
    }
  };

  return (
    <section className="flex-1 space-y-4 px-8">
      <Card className="border-0">
        <CardContent>
          <Formik
            initialValues={{
              documentCategoryName: "",
              title: "",
              description: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await handleCreateDocumentCategory(values);
            }}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-8 p-6">
                {/* Drag-and-Drop Thumbnail Selection */}
                <h2 className="text-center font-bold text-2xl">
                  Create Document
                </h2>

                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Document Name
                  </Label>
                  <Field
                    as={Input}
                    type="text"
                    id="documentCategoryName"
                    name="documentCategoryName"
                    placeholder="Enter document category name"
                    className="mt-1 p-3 border rounded-md w-full"
                  />
                  <ErrorMessage
                    name="documentCategoryName"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Document Name
                  </Label>
                  <Field
                    as={Input}
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter document name"
                    className="mt-1 p-3 border rounded-md w-full"
                  />
                  <ErrorMessage
                    name="title"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* new text editor plugin with description filed */}
                <div className="col-span-full">
                  <div className="md:col-span-4 col-span-6">
                    <div className="sm:col-span-6 h-full">
                      <div>
                        <Label
                          htmlFor="description"
                          className="text-sm font-medium"
                        >
                          Description
                        </Label>
                        <Field name="description">
                          {({ field, form }: any) => (
                            <div>
                              {/* Ensure onChange is properly called with setFieldValue */}
                              <TextEditor
                                value={field.value}
                                onChange={(value: any) =>
                                  form.setFieldValue("description", value)
                                }
                              />
                            </div>
                          )}
                        </Field>
                        <ErrorMessage
                          name="description"
                          component="div"
                          className="text-red-600 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      router.push("/document?tab=document")
                    }
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Document</Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </section>
  );
}
