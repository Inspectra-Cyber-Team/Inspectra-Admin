import { cyberApi } from "../api";

export const fileApi = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    uploadFile: builder.mutation<any, { file: FormData }>({
      query: ({ file }) => ({
        url: `files`,
        method: "POST",
        body: file,
      }),
    }),
    uploadMultipleFile: builder.mutation<any, { file: object }>({
      query: ({ file }) => ({
        url: `files/multiple`,
        method: "POST",
        body: file,
      }),
    }),
  }),
});

export const { useUploadFileMutation,useUploadMultipleFileMutation } = fileApi;