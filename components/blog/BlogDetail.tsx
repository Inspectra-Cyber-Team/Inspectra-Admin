"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetBlogDetailsQuery } from "@/redux/service/blog";
import { Blog } from "@/types/Blog";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { convertToDayMonthYear } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { useGetReportByBlogUuidQuery } from "@/redux/service/report";

type BlogDetailsProps = Readonly<{
  uuid: string;
}>;

export default function BlogPost({ uuid }: BlogDetailsProps) {
  const router = useRouter();

  const [blogData, setBlogData] = useState<Blog | undefined>();

  const { data: BlogData } = useGetBlogDetailsQuery({ uuid });

  const { data: reportData, isLoading: reportLoading } =
    useGetReportByBlogUuidQuery({ blogUuid: uuid });

  useEffect(() => {
    if (BlogData) {
      setBlogData(BlogData?.data);
    }
  }, [BlogData]);

  if (reportLoading) {
    return <div>Loading...</div>;
  }

  const modifiedDescription = blogData?.description.replace(
    /<img /g,
    '<img style="max-width: 100%; height: auto; display: block; margin: 0 auto; object-fit: contain;" '
  );

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-6 lg:grid-cols-[1fr,300px] md:grid-cols-[1fr]">
        {/* Blog Content */}
        <div className="space-y-6">
          <div className="flex flex-col gap-4 items-start md:items-start">
            <h1 className="text-3xl font-bold leading-tight md:text-left">
              {blogData?.title || "Untitled Blog"}
            </h1>
          </div>

          <div className="prose prose-gray max-w-none">
            {blogData?.thumbnail?.[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="w-full h-auto max-h-[400px] object-contain rounded-lg mt-5"
                src={blogData?.thumbnail?.[0] || ""}
                alt="thumbnail"
              />
            )}
            <div
              dangerouslySetInnerHTML={{ __html: modifiedDescription || "" }}
            ></div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Back Button */}
          <div>
            <Button
              className="w-full lg:w-auto mb-5 flex justify-center items-center gap-2"
              onClick={() => router.push("/blog")}
            >
              <ArrowLeft />
              Back to Blogs
            </Button>
            {/* Blog Details */}
            <Card className="border-none shadow-none">
              <CardContent className="p-6 space-y-4">
                <dl className="space-y-2">
                  {[
                    {
                      label: "Posted by",
                      value: `${blogData?.user?.firstName || "Unknown"} ${
                        blogData?.user?.lastName || ""
                      }`,
                    },
                    {
                      label: "Created at",
                      value: blogData?.createdAt
                        ? convertToDayMonthYear(blogData?.createdAt || "")
                        : "Unknown",
                    },
                    { label: "Total views", value: blogData?.viewsCount || 0 },
                    { label: "Total likes", value: blogData?.likesCount || 0 },
                    {
                      label: "Total comments",
                      value: blogData?.countComments || 0,
                    },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex flex-col md:flex-row md:gap-2"
                    >
                      <dt className="text-[#60935D]">{label}:</dt>
                      <dt className="font-medium">{value}</dt>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>
          </div>

          {/* Report Section */}
          <div>
            <Button className="w-full lg:w-auto mb-5">Report</Button>
            {reportData?.content?.map((report: any, index: any) => (
              <Card key={index} className="border-none shadow-none">
                <CardContent className="space-y-4 p-6">
                  <div className="space-y-2">
                    <div className="space-y-2">
                      <div className="flex flex-col md:flex-row md:gap-2">
                        <dt className="text-[#60935D]">Reported by:</dt>
                        <dt>{report.reportedBy}</dt>
                      </div>
                      <div className="flex flex-col md:flex-row md:gap-2">
                        <dt className="text-[#60935D]">
                          Report at: {report?.name || "user"}
                        </dt>
                        <dt>
                          {
                            new Date(report?.createdAt)
                              .toISOString()
                              .split("T")[0]
                          }
                        </dt>
                      </div>
                      <p className="text-sm mt-2 text-justify md:text-left">
                        {report.message}
                      </p>
                    </div>
                    <Separator className="my-4" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
