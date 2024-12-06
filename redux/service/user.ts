import { cyberApi } from "@/redux/api";


export const userAPI = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const {  useGetUserDetailQuery, useUpdateUserProfileMutation } = userAPI;