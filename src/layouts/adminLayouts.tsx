import DashboardSidebar from "./dashboardSidebar";
import DashboardHeader from "./dashboardHeader";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-200">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col bg-white">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
