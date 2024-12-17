import { cyberApi } from "@/redux/api";
import { ProjectNameType } from "@/types/ProjectNameType";

export const projectAPI = cyberApi.injectEndpoints({
  endpoints: (builder) => ({
    // create user Project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createProjectName: builder.mutation<any, { projectName: ProjectNameType }>({
      query: ({ projectName }) => ({
        url: `projects`,
        method: "POST",
        body: projectName,
      }),
    }),
    // get user Project
    getAllProjectsName: builder.query<any, void>({
      query: () => `/projects`, 
    }),

    // scan project
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createProjectScan: builder.mutation<any, { project: object }>({
      query: ({ project }) => ({
        url: `scans/next`,
        method: "POST",
        body: project,
      }),
    }),


    
  }),
});

export const {
  useCreateProjectNameMutation,
  useGetAllProjectsNameQuery,
  useCreateProjectScanMutation,
} = projectAPI;