import { Link, useLocation } from "react-router-dom";
import { siteConfig } from "@/config/site";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import clsx from "clsx";

function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { dashboardSidebar } = siteConfig;
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const getIconForItem = (label: string) => {
    switch (label.toLowerCase()) {
      case "dashboard":
        return "mdi:view-dashboard";
      case "products":
        return "mdi:package-variant";
      case "orders":
        return "mdi:shopping";
      case "categories":
        return "mdi:tag-multiple";
      case "users":
        return "mdi:account-group";
      case "reports":
        return "mdi:chart-line";
      case "settings":
        return "mdi:cog";
      case "blog":
        return "mdi:blog";
      case "promotional carousel":
        return "mdi:image-multiple";
      default:
        return "mdi:circle";
    }
  };

  return (
    <Card
      className={clsx(
        "h-full transition-all duration-300 ease-in-out border-r border-gray-100 rounded-none",
        isOpen ? "w-56" : "w-16"
      )}>
      <CardBody className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          {isOpen && (
            <h1 className="text-sm font-medium text-gray-900">Admin</h1>
          )}
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-gray-50 transition-colors">
            <Icon
              icon={isOpen ? "mdi:chevron-left" : "mdi:menu"}
              className="w-4 h-4 text-gray-600"
            />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="p-2">
          <div className="space-y-1">
            {dashboardSidebar.map((item) => {
              const active = isActive(item.href);
              return (
                <Button
                  key={item.href}
                  as={Link}
                  to={item.href}
                  variant={active ? "flat" : "light"}
                  className={clsx(
                    "w-full justify-start px-3 py-2.5 text-sm transition-colors",
                    isOpen ? "gap-3" : "justify-center",
                    active
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  title={!isOpen ? item.label : undefined}>
                  <Icon
                    icon={getIconForItem(item.label)}
                    className="w-6 h-6 flex-shrink-0"
                  />
                  {isOpen && (
                    <span className="font-medium truncate">{item.label}</span>
                  )}
                </Button>
              );
            })}
          </div>
        </nav>
      </CardBody>
    </Card>
  );
}

export default DashboardSidebar;
