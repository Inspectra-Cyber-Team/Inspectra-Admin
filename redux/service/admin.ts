import { cyberApi } from "../api";
export const adminAPI = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdmin: builder.mutation<any, { data: object }>({
      query: ({ data }: { data: any }) => ({
        url: `users/admin`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useCreateAdminMutation } = adminAPI;
