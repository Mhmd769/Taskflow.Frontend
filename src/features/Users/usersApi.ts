import axiosClient from "../../api/axiosClient";

export const getAllUsers = () => axiosClient.get("/Users");
export const getUserById = (id: string) => axiosClient.get(`/Users/${id}`);
export const createUser = (data: any) => axiosClient.post("/Users", data);
export const updateUser = (id: string, data: any) => axiosClient.put(`/Users/${id}`, data);
export const deleteUser = (id: string) => axiosClient.delete(`/Users/${id}`);
