import DashboardSidebar from "./dashboardSidebar";
import DashboardHeader from "./dashboardHeader";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col bg-gray-100">
        <DashboardHeader />

        <main className="flex-1 p-4 overflow-y-auto bg-gray-100 text-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
