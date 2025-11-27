import { createBrowserRouter } from "react-router-dom";
import Login from "./features/Auth/Login";
import Register from "./features/Auth/Register";
import Logout from "./features/Auth/Logout";
import Home from "./Pages/Home";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
  { path: "/logout", element: <Logout /> },

  { path: "/", element: <Login /> }, // default redirect
]);
