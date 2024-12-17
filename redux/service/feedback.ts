import { cyberApi } from "@/redux/api";
import { createFeedbackType } from "@/types/Feedback";

export const feedbackApi = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    // create user feedback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createUserFeedback: builder.mutation<any, { message: createFeedbackType }>({
      query: ({ message }) => ({
        url: `feedbacks`,
        method: "POST",
        body: message,
      }),
    }),
    // get user feedback
    getAllUserFeedback: builder.query<any, { page?: number; size?: number }>({
      query: ({ page , size }) => ({
        url: `feedbacks?page=${page}&size=${size}`,
      }),
      providesTags:[{type: "Feedback", id: "ALL1"}]
    }),

    countFeedback: builder.query({
      query: () => ({
        url: `feedbacks/count`,
    })
  }),

    deleteFeedback: builder.mutation<any, { uuid: string }>({
      query: ({ uuid }) => ({
        url: `feedbacks/${uuid}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Feedback", id: "ALL1" }],
  }),

})

});

export const { useCreateUserFeedbackMutation, useGetAllUserFeedbackQuery, useCountFeedbackQuery , useDeleteFeedbackMutation} =feedbackApi;