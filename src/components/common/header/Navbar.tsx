import React from "react";
import { Icon } from "@iconify/react";
import {
  Navbar as HeroNavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import { useAuth } from "../../../contexts/AuthContext";
import CartButton from "../../user/Cart/CartButton";
import CartDrawer from "../../user/Cart/CartDrawer";
import WishlistButton from "../../user/Whistlist/WishlistButton";
import WishlistDrawer from "../../user/Whistlist/WishlistDrawer";
import UserAvatar from "../UserAvatar";

export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const menuItems = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop" },
    { name: "BLOG", href: "/blog" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <>
      <HeroNavbar
        isBordered
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        className="bg-white/90 backdrop-blur-md">
        <NavbarContent>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden"
          />
          <NavbarBrand>
            <a
              href="/"
              className="text-2xl font-light tracking-wider text-gray-900">
              KAIRA
            </a>
          </NavbarBrand>
        </NavbarContent>

        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          {menuItems.map((item) => (
            <NavbarItem key={item.name}>
              <a
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
                {item.name}
              </a>
            </NavbarItem>
          ))}
        </NavbarContent>

        <NavbarContent justify="end">
          {/* Wishlist Button - Only show if authenticated */}
          {isAuthenticated && (
            <NavbarItem>
              <WishlistButton onOpenDrawer={() => setIsWishlistOpen(true)} />
            </NavbarItem>
          )}

          <NavbarItem>
            <CartButton onClick={() => setIsCartOpen(true)} />
          </NavbarItem>

          {/* Auth Section */}
          {isAuthenticated ? (
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button isIconOnly variant="light" className="p-0">
                    <UserAvatar user={user} size="md" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile actions">
                  <DropdownItem key="profile" className="h-14 gap-2">
                    <div className="flex items-center space-x-3">
                      <UserAvatar user={user} size="lg" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {user?.fullname}
                        </p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </DropdownItem>
                  <DropdownItem key="profile-link" href="/profile">
                    <Icon icon="lucide:user" width="16" height="16" />
                    Profile
                  </DropdownItem>
                  <DropdownItem key="order-link" href="/orders">
                    <Icon icon="lucide:shopping-bag" width="16" height="16" />
                    Orders
                  </DropdownItem>
                  <DropdownItem key="logout" color="danger" onClick={logout}>
                    <Icon icon="lucide:log-out" width="16" height="16" />
                    Logout
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          ) : (
            <NavbarItem>
              <Button
                as="a"
                color="primary"
                className="bg-gray-900 text-white"
                href="/auth/login"
                variant="flat">
                Sign In
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>

        <NavbarMenu>
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item.name}-${index}`}>
              <a
                href={item.href}
                className="w-full text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200">
                {item.name}
              </a>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </HeroNavbar>

      {/* Drawers */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
      />
    </>
  );
};
