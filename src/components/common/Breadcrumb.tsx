import React from "react";
import { Link, BreadcrumbItem, Breadcrumbs } from "@heroui/react";

export interface BreadcrumbItemData {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItemData[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className = "" }) => {
  return (
    <Breadcrumbs className={className}>
      {items.map((item, index) => (
        <BreadcrumbItem key={index} isCurrent={item.isActive}>
          {item.href && !item.isActive ? (
            <Link
              href={item.href}
              className="text-gray-500 hover:text-gray-700 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span
              className={
                item.isActive ? "text-gray-900 font-medium" : "text-gray-500"
              }>
              {item.label}
            </span>
          )}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
