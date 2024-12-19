import { cyberApi } from "@/redux/api";

export const documentCategoriesAPI = cyberApi.injectEndpoints({
    endpoints: (builder) => ({
        // get user feedback
        getAllDocumentCategories: builder.query({
            query: () => ({
                url: `document-categories/details`,
            }),
        }),
        getAllDocument: builder.query<any, void>({
            query: () => '/documents/all',
        }),

        useGetAllDocumentCategoriesQuery: builder.query<any,{page:number,size:number}>({
            query: ({page,size}) => ({
                url: `/document-categories?page=${page}&size=${size}`,
                method: 'GET',
            }),
        }),
    }),
});

export const { useGetAllDocumentCategoriesQuery, useGetAllDocumentQuery, useUseGetAllDocumentCategoriesQueryQuery } = documentCategoriesAPI;
