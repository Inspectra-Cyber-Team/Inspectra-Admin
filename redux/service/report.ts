
import { cyberApi } from "@/redux/api";

export const reportApi = cyberApi.injectEndpoints({

    endpoints: (builder) => ({

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        report: builder.mutation<any,  { report:object }>({
            query: ({ report }) => ({
                url: `/reports`,
                method: "POST",
                body: report ,
            }),
        }),

       // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllReport: builder.query<any,{ page: number; pageSize: number }>({
        query: ({ page = 1, pageSize = 10 }) =>
        ({
            url: `/reports/details?page=${page}&size=${pageSize}`,
        }),
      }),
    }),
}
);

export const { useReportMutation, useGetAllReportQuery } = reportApi;