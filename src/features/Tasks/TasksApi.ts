import axiosClient from "../../api/axiosClient";

// Tasks API
export const getAllTasks = () => axiosClient.get("/Tasks");
export const getTaskById = (id: string) => axiosClient.get(`/Tasks/${id}`);
export const createTask = (data: any) => axiosClient.post("/Tasks", data);
export const updateTask = (data: any) => axiosClient.put("/Tasks", data); // <-- fixed
export const deleteTask = (id: string) => axiosClient.delete(`/Tasks/${id}`);


export const changeStatus = (taskId: string, newStatus: number) =>
  axiosClient.post(`/Tasks/${taskId}/status`, newStatus, {
    headers: { "Content-Type": "application/json" },
  });

