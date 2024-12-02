import { cyberApi } from "../api";

export const authApi = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    login: builder.mutation<any, { data: object }>({
      query: ({ data }) => ({
        url: `auth/login/`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
