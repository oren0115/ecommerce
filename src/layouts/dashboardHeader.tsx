import { siteConfig } from "@/config/site";
import {
  Link,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useAuth } from "../contexts/AuthContext";

function DashboardHeader() {
  const { dashboardHeader } = siteConfig;
  const { user, logout } = useAuth();

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user?.fullname) return "U";
    return user.fullname
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    // Redirect to login page after logout
    window.location.href = "/auth/login";
  };

  // Create dropdown items array with logout functionality
  const dropdownItems = [
    ...dashboardHeader
      .filter((item) => item.href && item.label && item.label !== "Logout")
      .map((item) => (
        <DropdownItem
          key={item.href}
          as={Link}
          href={item.href}
          textValue={item.label}>
          <div className="flex items-center space-x-2">
            <Icon
              icon={
                item.label === "Profile" ? "lucide:user" : "lucide:settings"
              }
              width="14"
              height="14"
            />
            <span className="text-sm">{item.label}</span>
          </div>
        </DropdownItem>
      )),
    // Add logout item
    <DropdownItem
      key="logout"
      onClick={handleLogout}
      textValue="Logout"
      className="text-red-600">
      <div className="flex items-center space-x-2">
        <Icon icon="lucide:log-out" width="14" height="14" />
        <span className="text-sm">Logout</span>
      </div>
    </DropdownItem>,
  ];

  return (
    <header className="px-6 py-3 bg-white border-b border-gray-200">
      <div className="flex items-center justify-end">
        {/* Right side - User actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
            <Icon icon="lucide:bell" width="18" height="18" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User dropdown */}
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <button className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-50 rounded transition-colors">
                <Avatar
                  name={getUserInitials()}
                  size="sm"
                  className="bg-gray-900 text-white text-xs w-7 h-7"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullname || "User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <Icon
                  icon="lucide:chevron-down"
                  width="14"
                  height="14"
                  className="text-gray-400"
                />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="User actions" className="min-w-48">
              {dropdownItems}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
