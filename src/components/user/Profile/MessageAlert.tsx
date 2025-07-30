import React from "react";
import { Icon } from "@iconify/react";
import { Chip } from "@heroui/react";

interface MessageAlertProps {
  message: { type: "success" | "error"; text: string } | null;
}

const MessageAlert: React.FC<MessageAlertProps> = ({ message }) => {
  if (!message) return null;

  return (
    <Chip
      className={`p-4 w-full ${
        message.type === "success"
          ? "bg-green-50 border border-green-200 text-green-800"
          : "bg-red-50 border border-red-200 text-red-800"
      }`}
      startContent={
        <Icon
          icon={
            message.type === "success"
              ? "lucide:check-circle"
              : "lucide:alert-circle"
          }
          className="w-5 h-5"
        />
      }
      variant="flat"
      color={message.type === "success" ? "success" : "danger"}>
      <span className="text-sm font-medium">{message.text}</span>
    </Chip>
  );
};

export default MessageAlert;
