import { cyberApi } from "@/redux/api";

export const reportApi = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    report: builder.mutation<any, { report: object }>({
      query: ({ report }) => ({
        url: `/reports`,
        method: "POST",
        body: report,
      }),
    }),

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllReport: builder.query<any, { page: number; pageSize: number }>({
      query: ({ page, pageSize }) => ({
        url: `/reports/details?page=${page}&size=${pageSize}`,
      }),
      providesTags: [{type: "Report",id: 'ALL'}],
    }),

    getReportByBlogUuid: builder.query<any, { blogUuid: string }>({
      query: ({ blogUuid }) => ({
        url: `/reports/blog/${blogUuid}`,
      }),
    }),

    deleteReport: builder.mutation<any, { reportUuid: string }>({
      query: ({ reportUuid }) => ({
        url: `/reports/${reportUuid}`,
        method: "DELETE",
      }),
      invalidatesTags: [{type: "Report",id: 'ALL'}],
    }),
  }),
});

export const {
  useReportMutation,
  useGetAllReportQuery,
  useGetReportByBlogUuidQuery,
    useDeleteReportMutation,
} = reportApi;
