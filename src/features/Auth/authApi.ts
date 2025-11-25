import axiosClient from "../../api/axiosClient";

// REGISTER
export const registerUser = (data: {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
}) => axiosClient.post("/Auth/register", data);

// LOGIN
export const loginUser = (data: { email: string; password: string }) =>
  axiosClient.post("/Auth/login", data);