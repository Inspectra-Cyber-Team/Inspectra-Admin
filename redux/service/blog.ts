import { cyberApi } from "@/redux/api";

export const blogApi = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllBlog: builder.query<any,{ page: number; pageSize: number }>({
        query: ({ page = 1, pageSize = 10 }) =>
        ({
            url: `/blogs?page=${page}&pageSize=${pageSize}`,
        }),
      }),
  }),
});

export const {  useGetAllBlogQuery } = blogApi;