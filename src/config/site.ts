// import Dashboard from "@/components/admin/dashboard/Dashboard";s

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Vite + HeroUI",
  description: "Make beautiful websites regardless of your design experience.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Shop",
      href: "/shop",
    },
    {
      label: "Contact",
      href: "/contact",
    },
    {
      label: "Cart",
      href: "/cart",
    },
    {
      label: "Blog",
      href: "/blog",
    },
  ],
  navMenuItems: [
    {
      label: "Whislist",
      href: "/whislist",
    },
    {
      label: "Cart",
      href: "/cart",
    },
    {
      label: "Blog",
      href: "/blog",
    },
    {
      label: "Contact",
      href: "/contact",
    },
    {
      label: "Whislist",
      href: "/whislist",
    },
    {
      label: "Shop",
      href: "/shop",
    },
    {
      label: "Home",
      href: "/",
    },
  ],
  dashboardSidebar: [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
    },
    {
      label: "Products",
      href: "/admin/products",
    },
    {
      label: "Orders",
      href: "/admin/orders",
    },
    {
      label: "Categories",
      href: "/admin/categories",
    },
    {
      label: "Users",
      href: "/admin/users",
    },
    {
      label: "Reports",
      href: "/admin/reports",
    },
    {
      label: "Blog",
      href: "/admin/blog",
    },
    {
      label: "Promotional Carousel",
      href: "/admin/promotional-carousel",
    },
  ],
  dashboardHeader: [
    {
      label: "Profile",
      href: "/admin/profile",
    },
    {
      label: "Logout",
      href: "/admin/logout",
    },
  ],
  auth: [
    {
      label: "Login",
      href: "/auth/login",
    },
    {
      label: "Register",
      href: "/auth/register",
    },
  ],
};
