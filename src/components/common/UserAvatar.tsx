import React from "react";
import { Avatar } from "@heroui/react";
import { User } from "../../types";

interface UserAvatarProps {
  user: User | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  size = "md",
  className = "",
}) => {
  const sizeMap: Record<string, "sm" | "md" | "lg"> = {
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "lg",
  };

  const avatarSize = sizeMap[size];

  return (
    <Avatar
      size={avatarSize}
      src={user?.avatar}
      name={user?.fullname || "User"}
      className={className}
      showFallback
    />
  );
};

export default UserAvatar;
