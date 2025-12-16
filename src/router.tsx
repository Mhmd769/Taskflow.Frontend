import { createBrowserRouter } from "react-router-dom";
import Login from "./features/Auth/Login";
import Register from "./features/Auth/Register";
import Logout from "./features/Auth/Logout";
import Home from "./Pages/Home";
import UsersPage from "./features/Users/UsersPage";
import ProjectsPage from "./features/Projects/ProjectsPage";
import TasksPage from "./features/Tasks/TasksPage";
import ProjectDetails from "./features/Projects/ProjectDetailsModal";
import TaskManagement from "./features/Tasks/TaskManagement";
import MainLayout from "./MainLayout";
import AdminDashboard from "./features/Admin/AdminDashboard";
import ChatPage from "./Chat/ChatPage";

export const router = createBrowserRouter([
  // ❌ Pages WITHOUT navbar
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/", element: <Login /> },

  // ✅ Pages WITH navbar
  {
    element: <MainLayout />,   // 👈 The layout with the navbar
    children: [
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/home", element: <Home /> },
      { path: "/users", element: <UsersPage /> },
      { path: "/projects", element: <ProjectsPage /> },
      { path: "/tasks", element: <TasksPage /> },
      { path: "/projects/:id", element: <ProjectDetails /> },
      { path: "/taskmangement", element: <TaskManagement /> },
      { path:"/chat/:otherUserId" , element: <ChatPage /> },
      { path: "/logout", element: <Logout /> },
    ],
  },
]);
