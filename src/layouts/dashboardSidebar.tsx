import { Link, useLocation } from "react-router-dom";
import { siteConfig } from "@/config/site";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Button } from "@heroui/react";
import clsx from "clsx";

function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { dashboardSidebar } = siteConfig;
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getIconForItem = (label: string) => {
    switch (label.toLowerCase()) {
      case "dashboard":
        return "lucide:layout-dashboard";
      case "products":
        return "lucide:package";
      case "orders":
        return "lucide:shopping-cart";
      case "categories":
        return "lucide:tags";
      case "users":
        return "lucide:users";
      case "reports":
        return "lucide:bar-chart-3";
      case "settings":
        return "lucide:settings";
      case "blog":
        return "lucide:edit";
      case "promotional carousel":
        return "lucide:images";
      default:
        return "lucide:circle";
    }
  };

  return (
    <aside
      className={clsx(
        "h-screen bg-white/80 backdrop-blur-sm border-r border-gray-200 transition-all duration-300 ease-out flex flex-col",
        isOpen ? "w-64" : "w-27"
      )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 ">
        {isOpen && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Icon icon="lucide:zap" className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Admin Dashboard
            </span>
          </div>
        )}

        {!isOpen && (
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center mx-auto">
            <Icon icon="lucide:zap" className="w-4 h-4 text-white" />
          </div>
        )}

        {isOpen && (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 min-w-8 hover:bg-gray-100 transition-colors rounded-lg">
            <Icon
              icon="lucide:panel-left-close"
              className="w-4 h-4 text-gray-500"
            />
          </Button>
        )}
      </div>

      {/* Collapse Button for Closed State */}
      {!isOpen && (
        <div className="p-2">
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-10 min-w-12 hover:bg-gray-100 transition-colors rounded-lg mx-auto">
            <Icon
              icon="lucide:panel-left-open"
              className="w-4 h-4 text-gray-500"
            />
          </Button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {dashboardSidebar.map((item) => {
          const active = isActive(item.href);
          return (
            <Button
              key={item.href}
              as={Link}
              to={item.href}
              variant="light"
              className={clsx(
                "w-full h-11 transition-all duration-200 font-medium text-sm rounded-xl",
                isOpen ? "justify-start px-3 gap-3" : "justify-center px-2",
                active
                  ? "bg-gray-100 text-gray-700 shadow-sm border border-gray-100/50"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
              title={!isOpen ? item.label : undefined}>
              <Icon
                icon={getIconForItem(item.label)}
                className={clsx(
                  "flex-shrink-0 transition-colors",
                  active ? "w-5 h-5 text-gray-900" : "w-5 h-5",
                  !isOpen && "w-5 h-5"
                )}
              />
              {isOpen && (
                <span className="truncate font-medium">{item.label}</span>
              )}
              {isOpen && active && (
                <div className="ml-auto w-2 h-2 bg-gray-900 rounded-full"></div>
              )}
            </Button>
          );
        })}
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="p-4 border-t border-gray-100/80">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
        </div>
      )}
    </aside>
  );
}

export default DashboardSidebar;
