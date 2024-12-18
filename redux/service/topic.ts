import { cyberApi } from "../api";

export const topicApi = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAllTopic: builder.query<
      any,
      {  page: number; pageSize: number }
    >({
      query: ({page, pageSize }) => ({
        url: `/topics?page=${page}&size=${pageSize}`,
      }),
      providesTags: [{ type: "Topic", id: "TOPIC" }],
    }),
    
    useGetTopicName: builder.query<any,{topicName: string, page: number, pageSize: number}>({
      query: ({topicName, page, pageSize }) => ({
        url: `/topics/${topicName}?page=${page}&size=${pageSize}`,
      }),
      
    }),

    useCreatTopic: builder.mutation<any, { name: string }>({
      query: ({ name }) => ({
        url: "/topics",
        method: "POST",
        body: {name},
      }),
      invalidatesTags: [{ type: "Topic", id: "TOPIC" }],
    }),

    useDeleleteTopic: builder.mutation<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `/topics/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Topic", id: "TOPIC" }],
    }),

    useUpdateTopic: builder.mutation<any, { uuid: string, name: string }>({
      query: ({ uuid, name }) => ({
        url: `/topics/${uuid}?topicName=${name}`,
        method: "PUT",
      }),
      invalidatesTags: [{ type: "Topic", id: "TOPIC" }],
  }),

}),
});

export const { useGetAllTopicQuery, useUseGetTopicNameQuery, useUseCreatTopicMutation, useUseDeleleteTopicMutation, useUseUpdateTopicMutation } = topicApi;