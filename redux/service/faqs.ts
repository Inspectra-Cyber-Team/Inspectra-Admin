import { cyberApi } from "@/redux/api";

export const faqApi = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllFAQ: builder.query<any, void>({
      query: () => '/faqs',
    }),
  }),
});

export const {  useGetAllFAQQuery } = faqApi;