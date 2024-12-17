import { cyberApi } from "@/redux/api";

export const faqApi = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFAQ: builder.query<any, void>({
      query: () => '/faqs',
    }),
    deleteFAQ: builder.mutation<any, {uuid:string }>({
			query: ({uuid}) => ({
				url: `faqs/${uuid}`,
				method: "DELETE",
			}),
		}),
    updateFAQ: builder.mutation<any, { uuid: string, question: string, answer: string}>({
      query: ({ uuid, question, answer }) => ({
          url: `faqs/${uuid}`,
          method: "PUT",
          body: { question, answer },
      }),
    }),
    createFAQ: builder.mutation<any, { question: string, answer: string}>({
      query: ({ question, answer }) => ({
          url: `faqs`,
          method: "POST",
          body: { question, answer },
      }),
    }),
  }),
});

export const {  useGetAllFAQQuery, useDeleteFAQMutation , useUpdateFAQMutation, useCreateFAQMutation} = faqApi;