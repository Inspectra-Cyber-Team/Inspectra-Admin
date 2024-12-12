import { cyberApi } from "../api";
export const adminAPI = cyberApi.injectEndpoints({
  endpoints: (builder) => ({

    getAllAdmin: builder.query<any,{ page: number; pageSize: number }>({
      query: ({ page = 1, pageSize = 10 }) =>
      ({
          url: `/users?page=${page}&size=${pageSize}`,
          providesTags: ["Admin"],
      }),
    }),


    getAdminDetail: builder.query<any, {uuid: string}>({
      query: ({uuid}) => ({
        url: `/users/${uuid}`,
        providesTags: ["Admin"],
      }),
    }),


    createAdmin: builder.mutation<any, { data: object }>({
      query: ({ data }: { data: any }) => ({
        url: `users/admin`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateAdminMutation, useGetAdminDetailQuery, useGetAllAdminQuery } = adminAPI;
