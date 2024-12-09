import BlogDetailsComponent from "@/components/blog/BlogDetail";
// import { Params } from "@/types/Params";

export default async function BlogDetailsPage({ params }: { params: Promise<{ uuid: string }> }) {

  const resolvedParams = await params; // Await params if it's a promise

  const uuid = resolvedParams?.uuid;

  return (
    <section>
      <div>
        <BlogDetailsComponent uuid={uuid} />
      </div>
    </section>
  );
}
