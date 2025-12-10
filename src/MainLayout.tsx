import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";

export default function MainLayout() {
  return (
    <>
      <Navbar />    {/* Shows on every protected page */}
      <div className="p-4">
        <Outlet />  {/* Page content */}
      </div>
    </>
  );
}
