"use client";
import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUploadFileMutation } from "@/redux/service/fileupload";
import { useToast } from "@/components/hooks/use-toast";
import {
  useUpdateBlogMutation,
  useGetBlogByUuidQuery,
} from "@/redux/service/blog";
import { useRouter } from "next/navigation";
import TextEditor from "@/components/TextEdittor/TextEditor";
import { XCircle } from "lucide-react";

type UpdateBlogComponentProps = {
  uuid: string;
};

const FILE_SIZE = 1024 * 1024 * 5; // 5MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string().required("Description is Required"),
  thumbnail: Yup.array().of(
    Yup.mixed()
      .test("fileFormat", "Unsupported Format", (value: any) => {
        if (!value) return true;
        return SUPPORTED_FORMATS.includes(value.type);
      })
      .test("fileSize", "File Size is too large", (value: any) => {
        if (!value) return true;
        return value.size <= FILE_SIZE;
      })
  ),
});

export const UpdateBlogComponent = ({ uuid }: UpdateBlogComponentProps) => {
  const router = useRouter();
  const { data: blogUpdateData } = useGetBlogByUuidQuery({ uuid });
  const { toast } = useToast();
  const [uploadFile] = useUploadFileMutation();
  const [updateBlog] = useUpdateBlogMutation();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      SUPPORTED_FORMATS.includes(file.type)
    );

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleFileUpload = async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file: any) => {
      formData.append("files", file);
    });

    try {
      const response = await uploadFile({ file: formData }).unwrap();
      return response.data; // Return file URLs
    } catch (error) {
      console.error("File Upload Error:", error);
      return [];
    }
  };

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const files = Array.from(e.target.files || []);
    setFieldValue("thumbnail", files);

    // Generate previews for selected images
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleUpdateBlog = async (values: any) => {
    try {
      const response = await updateBlog({ uuid: uuid, ...values }).unwrap();

      console.log("Update Blog Response:", response);

      if (response.status === 200) {
        toast({
          title: "Blog Updated",
          description: "Your blog has been updated successfully",
          variant: "success",
        });
        router.push("/blog");
      }
    } catch (error) {
      console.error("File Upload Error:", error);
    }
  };

  useEffect(() => {
    if (blogUpdateData?.data?.thumbnail) {
      const previews = blogUpdateData?.data?.thumbnail;
      setPreviewImages(previews);
    }
  }, [blogUpdateData?.data?.thumbnail]);

  const initialValues = {
    title: blogUpdateData?.data?.title || "",
    description: blogUpdateData?.data?.description || "",
    thumbnail: [],
  };

  return (
    <div className="space-y-4 p-8">
      <Card>
        <CardContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            enableReinitialize
            onSubmit={async (values) => {
              try {
                let updatedThumbnails = previewImages;

                if (values.thumbnail.some((file) => typeof file !== "string")) {
                  updatedThumbnails = await handleFileUpload(
                    values.thumbnail.filter((file) => typeof file !== "string")
                  );
                }

                const finalThumbnails = [
                  ...previewImages.filter(
                    (url) => typeof url === "string" && !url.startsWith("blob:")
                  ),
                  ...updatedThumbnails,
                ];

                const updatedValues = {
                  ...values,
                  thumbnail: finalThumbnails,
                };

                await handleUpdateBlog(updatedValues);
              } catch (error) {
                console.error("Error updating blog:", error);
              }
            }}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-8 bg-card p-6">
                <h2 className="text-center font-bold text-2xl">
                  Update Blog
                </h2>

                {/* Thumbnail Upload */}
                <div
                  className="file-upload-design p-6 rounded-xl border-2 border-dashed flex items-center justify-center flex-col gap-2"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <p className="text-center font-medium">
                    Drag and Drop Images Here
                  </p>
                  <p className="text-center text-gray-500">or</p>
                  <span
                    className="browse-button text-primary-foreground cursor-pointer justify-center bg-primary p-2 rounded-lg"
                    onClick={() => {
                      const thumbnailInput =
                        document.getElementById("thumbnail");
                      if (thumbnailInput) thumbnailInput.click();
                    }}
                  >
                    Browse Files
                  </span>
                  {/* <Label htmlFor="thumbnail" className="block text-lg font-medium mt-4 object-contain">Thumbnail</Label> */}
                  <Input
                    type="file"
                    id="thumbnail"
                    name="thumbnail"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                    className="hidden"
                  />
                </div>

                {/* Preview Images */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  {previewImages.map((src, index) => (
                    <div key={index} className="relative">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <XCircle
                        type="button"
                        className="absolute -top-2 -right-0  text-destructive  cursor-pointer"
                        onClick={() => {
                          const updatedFiles = [...previewImages];
                          updatedFiles.splice(index, 1);
                          setPreviewImages(updatedFiles);
                        }}
                      >
                      </XCircle>
                    </div>
                  ))}
                </div>

                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">Title</Label>
                  <Field
                    as={Input}
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter blog title"
                    className="mt-2 p-3 border rounded-md w-full "
                  />
                  <ErrorMessage
                    name="title"
                    component="p"
                    className="text-destructive text-sm mt-1"
                  />
                </div>

                {/* Description */}
                <div className="col-span-full mt-4">
                  <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                  <Field name="description" className="mt-2 p-3 border rounded-md w-full ">
                    {({ field }: any) => (
                      <TextEditor
                        value={field.value}
                        onChange={(value) => setFieldValue("description", value)}
                      />
                    )}
                  </Field>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-destructive text-sm"
                  />
                </div>

                {/* Submit Button */}
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" onClick={() => router.push("/blog")}>
                    Cancel
                  </Button>
                  <Button type="submit" >
                    Update Blog
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateBlogComponent;