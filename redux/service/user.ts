import { cyberApi } from "@/redux/api";


export const userAPI = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUser: builder.query<any,{ page: number; pageSize: number }>({
      query: ({ page = 1, pageSize = 10 }) =>
      ({
          url: `users?page=${page}&size=${pageSize}`,
      }),
    }),
    // get user feedback
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getUserDetail: builder.query<any, {uuid: string}>({
      query: ({uuid}) => ({
        url: `/users/${uuid}`,
        providesTags: ["User"],
      }),
    }),
    // update user profile
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateUserProfile: builder.mutation<any, {userProfile: object}>({
      query: ({userProfile}) => ({
        url: `users/profile`,
        method: "PUT",
        body: userProfile,
      }),
  }),
   
    countUser: builder.query({
      query: () => ({
        url: `users/count`,
      }),
    }),

    blockUser: builder.mutation<any, {uuid: string}>({
      query: ({uuid}) => ({
        url: `/users/block/${uuid}`,
        method: "PUT",
      }),
    }),


})
})

export const {useBlockUserMutation,  useGetUserDetailQuery, useUpdateUserProfileMutation, useGetAllUserQuery ,useCountUserQuery} = userAPI;