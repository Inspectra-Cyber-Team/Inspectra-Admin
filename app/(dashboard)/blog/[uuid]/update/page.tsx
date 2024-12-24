import UpdateBlogComponent from "@/components/blog/UpdateBlogComponent";

export default async function UpdateBlog({
  params,
}: {
  params: Promise<{ uuid: string }>;
}) {
  const resolvedParams = await params; // Await params if it's a promise

  const uuid = resolvedParams?.uuid;

  return (
    <section>
      <UpdateBlogComponent uuid={uuid} />
    </section>
  );
}
