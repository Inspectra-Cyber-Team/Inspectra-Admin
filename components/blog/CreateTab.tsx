"use client";

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useUploadMultipleFileMutation } from "@/redux/service/fileupload";
import { useCreateBlogMutation } from "@/redux/service/blog";
import { useToast } from "@/components/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useGetAllTopicQuery } from "@/redux/service/topic";
import { Plus, XCircle } from "lucide-react";
import RichTextEditor from "../test";

const FILE_SIZE = 1024 * 1024 * 5; // 5MB
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/gif"];

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is Required"),
  description: Yup.string().required("Description is Required"),
  topic: Yup.string().required("Topic is Required"),
  thumbnail: Yup.array()
    .of(
      Yup.mixed()
        .test("fileFormat", "Unsupported Format", (value: any) => {
          if (!value) return true;
          return SUPPORTED_FORMATS.includes(value.type);
        })
        .test("fileSize", "File Size is too large", (value: any) => {
          if (!value) return true;
          return value.size <= FILE_SIZE;
        })
    )
    .min(1, "Please select image."),
});

export function CreateTab() {
  const router = useRouter();

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

  const removeImage = (index: number) => {
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);
    setPreviewImages(updatedPreviews);
  };

  const { data: topics } = useGetAllTopicQuery({ page: 0, pageSize: 25 });

  const { toast } = useToast();

  const [uploadFile] = useUploadMultipleFileMutation();

  const [createBlog] = useCreateBlogMutation();

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

  const [selectedTopic, setSelectedTopic] = useState<string | null>("");

  const handleCreateBlog = async (value: any) => {
    try {
      const response = await createBlog({
        title: value.title,
        description: value.description,
        topic: value.topic,
        thumbnail: value.thumbnail,
      });

      if (response.data) {
        toast({
          description: "Blog Created Successfully",
          variant: "success",
        });
        router.push("/blog?tab=overview");
      }
    } catch {
      toast({
        description: "Failed to create blog",
        variant: "error",
      });
    }
  };

  return (
    <section>
      <Card className="border-0">
        <CardContent>
          <Formik
            initialValues={{
              title: "",
              description: "",
              topic: "",
              customTopic: "",
              thumbnail: [],
            }}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              // Ensure uploaded images are processed
              const uploadedImages = await handleFileUpload(values.thumbnail);

              if (uploadedImages.length > 0) {
                const updatedValues = {
                  ...values,
                  thumbnail: uploadedImages, // Set the uploaded URLs
                  topic:
                    selectedTopic === "other"
                      ? values.customTopic
                      : selectedTopic,
                };
                await handleCreateBlog(updatedValues);
              } else {
                console.error("No files uploaded");
              }
            }}
          >
            {({ setFieldValue }) => (
              <Form className="space-y-8 p-6">
                {/* Drag-and-Drop Thumbnail Selection */}
                <h2 className="text-center font-bold text-2xl">Create Blog</h2>

                <div
                  className="file-upload-design mt-4 p-6 rounded-lg border-2 border-dashed ransition-all duration-300 ease-in-out hover:border-blue-400 "
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="flex flex-col items-center justify-center space-y-2 text-center">
                    <p className="text-sm font-medium text-gray-700 dark:text-text_color_dark">
                      Drag and Drop Thumbnail Here
                    </p>
                    {/* <p className="text-sm text-gray-500">or</p> */}
                    <button
                      type="button"
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full  text-black  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                      onClick={() => {
                        const thumbnailInput =
                          document.getElementById("thumbnail");
                        if (thumbnailInput) thumbnailInput.click();
                      }}
                    >
                      <Plus className="h-6 w-6 dark:text-text_color_dark" />
                      <span className="sr-only">Browse Files</span>
                    </button>
                  </div>

                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, setFieldValue)}
                    className="hidden"
                  />
                  <ErrorMessage
                    name="thumbnail"
                    component="p"
                    className="text-red-500 text-sm mt-2 text-center"
                  />
                </div>

                {/* Preview Selected Thumbnails */}
                {previewImages.length > 0 && (
                  <div className="w-1/3 mx-auto">
                    {previewImages.map((src, index) => (
                      <div key={index} className="relative">
                        <img
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="w-full  object-container rounded-md border"
                        />
                        <XCircle
                          type="button"
                          className="absolute top-0 right-0 cursor-pointer text-destructive"
                          onClick={() => removeImage(index)}
                        ></XCircle>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Title
                  </Label>
                  <Field
                    as={Input}
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter blog title"
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
                              {/* <TextEditor
                                value={field.value}
                                onChange={(value: any) =>
                                  form.setFieldValue("description", value)
                                }
                              /> */}
                              <RichTextEditor
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

                <div>
                  <Label htmlFor="topic" className="text-sm font-medium">
                    Blog Topic
                  </Label>
                  <Field name="topic">
                    {({ field, form }: any) => (
                      <Select
                        {...field}
                        id="topic"
                        className="mt-1"
                        onValueChange={(value) => {
                          form.setFieldValue("topic", value);
                          setSelectedTopic(value);
                        }}
                        value={field.value || ""}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a topic" />
                        </SelectTrigger>
                        <SelectContent className="SelectContent">
                          <SelectGroup>
                            <SelectLabel>Topics</SelectLabel>
                            {topics?.content
                              .filter((topic: any) => topic.name !== "other")
                              .map((topic: any) => (
                                <SelectItem key={topic.uuid} value={topic.name}>
                                  {topic.name}
                                </SelectItem>
                              ))}
                            {/* Append "Other" at the end */}
                            {topics?.content
                              .filter((topic: any) => topic.name === "other")
                              .map((topic: any) => (
                                <SelectItem key={topic.uuid} value={topic.name}>
                                  {topic.name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  </Field>
                  <ErrorMessage
                    name="topic"
                    component="p"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {selectedTopic === "other" && (
                  <div className="mt-2">
                    <Label htmlFor="customTopic">Custom Topic</Label>
                    <Field
                      as={Input}
                      type="text"
                      id="customTopic"
                      name="customTopic"
                      placeholder="Enter your custom topic"
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="customTopic"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/blog?tab=overview")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Create Blog</Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardContent>
      </Card>
    </section>
  );
}
