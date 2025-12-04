import { createBrowserRouter } from "react-router-dom";
import Login from "./features/Auth/Login";
import Register from "./features/Auth/Register";
import Logout from "./features/Auth/Logout";
import Home from "./Pages/Home";
import UsersPage from "./features/Users/UsersPage";
import ProjectsPage from "./features/Projects/ProjectsPage";
import TasksPage from "./features/Tasks/TasksPage";

export const router = createBrowserRouter([
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
    { path: "/home", element: <Home /> },
  { path: "/logout", element: <Logout /> },

  {path: "/users", element: <UsersPage />},
  {path: "/projects", element: <ProjectsPage />},
  {path: "/tasks", element: <TasksPage />},
  { path: "/", element: <Login /> }, // default redirect
]);
