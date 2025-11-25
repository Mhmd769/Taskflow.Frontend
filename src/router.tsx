import { createBrowserRouter } from "react-router-dom";
import Login from "./features/Auth/Login";
import Register from "./features/Auth/Register";
import LoginSuccess from "./Pages/LoginSuccess";
import Logout from "./features/Auth/Logout";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
    { path: "/login-success", element: <LoginSuccess /> },
  { path: "/logout", element: <Logout /> },

  { path: "/", element: <Login /> }, // default redirect
]);
