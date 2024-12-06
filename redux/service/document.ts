import { cyberApi } from "@/redux/api";

export const documentCategoriesAPI = cyberApi.injectEndpoints({
    endpoints: (builder) => ({
        // get user feedback
        getAllDocumentCategories: builder.query({
            query: () => ({
                url: `document-categories/details`,
            }),
        }),
    }),
});

export const { useGetAllDocumentCategoriesQuery } = documentCategoriesAPI;
