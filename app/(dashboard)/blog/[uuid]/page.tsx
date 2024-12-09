import BlogDetailsComponent from "@/components/blog/BlogDetail";
import { Params } from "@/types/Params";



export default async function BlogDetailsPage(props: Params)  {

    const blogUuid = props?.params?.uuid;

    return (
        <section>
            <div>
                <BlogDetailsComponent uuid={blogUuid} />
            </div>
        </section>
    );
}


