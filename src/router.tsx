import { createBrowserRouter } from "react-router-dom";
import Login from "./features/Auth/Login";
import Register from "./features/Auth/Register";
import LoginSuccess from "./Pages/LoginSuccess";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
    { path: "/login-success", element: <LoginSuccess /> },

  { path: "/", element: <Login /> }, // default redirect
]);
