import { cyberApi } from "@/redux/api";
import { verify } from "crypto";

export const blogApi = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllBlog: builder.query<any, { page: number; pageSize: number }>({
      query: ({ page = 1, pageSize = 10 }) => ({
        url: `/blogs/verified?page=${page}&size=${pageSize}`,
      }),
    }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    likeBlog: builder.mutation<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `/blogs/${uuid}/like`,
        method: "POST",
      }),
    }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getBlogDetails: builder.query<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `/blogs/${uuid}`,
        method: "GET",
      }),
    }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getBlogByUserUuid: builder.query<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `/blogs/user/${uuid}`,
        method: "GET",
      }),
    }),

    createBlog: builder.mutation<
      any,
      { title: string; description: string; topic: string; thumbnail: string }
    >({
      query: ({ title, description, topic, thumbnail }) => ({
        url: `blogs`,
        method: "POST",
        body: { title, description, topic, thumbnail },
      }),
    }),

    updateBlog: builder.mutation<
      any,
      {
        uuid: string;
        title: string;
        description: string;
        topic: string;
        thumbnail: string;
      }
    >({
      query: ({ uuid, title, description, thumbnail }) => ({
        url: `blogs/${uuid}`,
        method: "PUT",
        body: { title, description, thumbnail },
      }),
    }),

    getBlogByUuid: builder.query<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `blogs/${uuid}`,
        method: "GET",
      }),
    }),

    verifyBlog: builder.mutation<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `blogs/${uuid}/verify`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),

    countBlog: builder.query<any, {}>({
      query: () => ({
        url: `blogs/count`,
        method: "GET",
      }),
    }),

    getAllBlogUnVerified: builder.query<any,  { page: number; pageSize: number }
    >({
      query: ({ page, pageSize }) => ({
        url: `/blogs?page=${page}&size=${pageSize}`,
      }),

      providesTags: [{ type: "Blog", id: "LIST" }],
    }),

    deleteBlog: builder.mutation<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `blogs/${uuid}`,
        method: "DELETE",
      }),

      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),
  }),
});

export const {
  useGetAllBlogUnVerifiedQuery,
  useGetAllBlogQuery,
  useLikeBlogMutation,
  useGetBlogDetailsQuery,
  useGetBlogByUserUuidQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useGetBlogByUuidQuery,
  useVerifyBlogMutation,
  useCountBlogQuery,
  useDeleteBlogMutation
} = blogApi;
