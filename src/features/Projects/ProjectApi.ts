import axiosClient from "../../api/axiosClient";

export const getAllProjects = () => axiosClient.get("/Projects");
export const getProjectById = (id: string) => axiosClient.get(`/Projects/${id}`);
export const createProject = (data: any) => axiosClient.post("/Projects", data);
export const updateProject = (id: string, data: any) => axiosClient.put(`/Projects/${id}`, data);
export const deleteProject = (id: string) => axiosClient.delete(`/Projects/${id}`);