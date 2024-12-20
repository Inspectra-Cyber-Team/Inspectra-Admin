'use client'
import { useToast } from '@/hooks/use-toast';
import { useGetDocoumentQuery,useUpdateDocumentMutation } from '@/redux/service/document';
import { useRouter } from 'next/navigation';
import React from 'react'
import * as Yup from 'yup';
import { Card, CardContent } from "@/components/ui/card";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Input } from '../ui/input';
import TextEditor from '../TextEdittor/TextEditor';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

type DocumentUpdateProps = {
  readonly uuid: string;
}

const validationSchema = Yup.object().shape({

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


export default function DocumentUpdateComponent({uuid}:DocumentUpdateProps) {

  const router = useRouter();

  const {toast} = useToast();

  const { data, isLoading } = useGetDocoumentQuery({uuid:uuid});

  const [updateDocument] = useUpdateDocumentMutation();

  if (isLoading) return <div>Loading...</div>;


  const handleUpdateDocument = async (uuid: string, body: object) => {

    try {

      const res = await updateDocument({uuid:uuid, body:body});
      
      if (res.data)
      {
        toast ({
           description: "Document updated successfully",
           variant: "success"
        })

        router.push("/document?tab=document");
      }
      else {
        toast ({
          description: "Document update failed",
          variant: "error"
        })
      }

    } catch {
      toast ({
        description: "Document update failed",
        variant: "error"
      })
    }

  }

  const initValue = {
    title: data?.data?.title,
    description: data?.data?.description
  }
  

  return (
    <section className="flex-1 space-y-4 px-8">
        <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/document?tab=document">Document</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Update Document</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
      <Card className="border-0">
        <CardContent>
          <Formik
            initialValues={initValue}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await handleUpdateDocument(uuid, values);
            }}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-8 p-6">
                {/* Drag-and-Drop Thumbnail Selection */}
                <h2 className="text-center font-bold text-2xl">
                  Update Document
                </h2>

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
  )
}
