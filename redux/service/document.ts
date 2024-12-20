import { cyberApi } from "@/redux/api";
import { create } from "domain";

export const documentCategoriesAPI = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    // get user feedback
    getAllDocumentCategories: builder.query({
      query: () => ({
        url: `document-categories/details`,
      }),
    }),
    getAllDocument: builder.query<any, void>({
      query: () => "/documents/all",
      providesTags: [{ type: "Document", id: "Document" }],
    }),

    createDocument: builder.mutation<any, { body: object }>({
      query: ({ body }) => ({
        url: `documents`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: [{ type: "Document", id: "Document" }],
    }),

    getDocoument: builder.query<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `documents/${uuid}`,
        method: "GET",
      }),
    }),

    updateDocument: builder.mutation<any, { uuid: string; body: object }>({
      query: ({ uuid, body }) => ({
        url: `documents/${uuid}`,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: [{ type: "Document", id: "Document" }],
    }),

    deletDocument: builder.mutation<any, { uuid: string }>({	
      query: ({ uuid }) => ({	
        url: `documents/${uuid}`,	
        method: "DELETE",	
      }),	
      invalidatesTags: [{ type: "Document", id: "Document" }],	
    }),

    useGetAllDocumentCategoriesQuery: builder.query<
      any,
      { page: number; size: number }
    >({
      query: ({ page, size }) => ({
        url: `/document-categories?page=${page}&size=${size}`,
        method: "GET",
      }),
      providesTags: [{ type: "Document", id: "DocumentCategory" }],
    }),

    createDocumentCategory: builder.mutation<any, { body: object }>({
      query: ({ body }) => ({
        url: `document-categories`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: [{ type: "Document", id: "DocumentCategory" }],
    }),

    getDocumentCategory: builder.query<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `document-categories/${uuid}`,
        method: "GET",
      }),
    }),

    deleteDocumentCategory: builder.mutation<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `document-categories/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Document", id: "DocumentCategory" }],

    }),

    useUpdateDocumentCategoryMutation: builder.mutation<any, {uuid:string, body: object }>({
        query: ({ uuid,body }) => ({
            url: `document-categories/${uuid}`,
            method: "PUT",
            body: body,
        }),
        invalidatesTags: [{ type: "Document", id: "DocumentCategory" }],
        }),


  }),
});

export const {
  useGetAllDocumentCategoriesQuery,
  useGetDocoumentQuery,
  useCreateDocumentMutation,
  useGetAllDocumentQuery,
  useUpdateDocumentMutation,
  useDeletDocumentMutation,
  useUseGetAllDocumentCategoriesQueryQuery,
  useGetDocumentCategoryQuery,
  useCreateDocumentCategoryMutation,
  useDeleteDocumentCategoryMutation,
  useUseUpdateDocumentCategoryMutationMutation
} = documentCategoriesAPI;
