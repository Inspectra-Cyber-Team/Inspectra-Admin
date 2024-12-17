import { cyberApi } from "../api";
export const adminAPI = cyberApi.injectEndpoints({
  endpoints: (builder) => ({


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
      invalidatesTags: [{ type: "USER", id: "LIST1" }],
    }),

    getAdmin:builder.query<any,{page:number,size:number}>({
      query: ({page,size}) => ({
        url: `users/admins?page=${page}&size=${size}`,
        method: "GET",
      }),
      providesTags: [{ type: "USER", id: "LIST1" }],
    }),

  }),
});

export const { useCreateAdminMutation, useGetAdminDetailQuery , useGetAdminQuery} = adminAPI;
