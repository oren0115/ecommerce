import React from "react";
import { CardHeader } from "@heroui/react";

interface ProfileHeaderProps {
  title: string;
  subtitle: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ title, subtitle }) => {
  return (
    <CardHeader className="px-6 py-4 border-b border-gray-200">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </CardHeader>
  );
};

export default ProfileHeader;
