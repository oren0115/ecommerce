import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Button, Input, Card, CardBody } from "@heroui/react";
import { useAuth } from "../../../contexts/AuthContext";

interface PasswordFormProps {
  onSuccess?: () => void;
}

const PasswordForm: React.FC<PasswordFormProps> = ({ onSuccess }) => {
  const { updatePassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi kata sandi tidak cocok" });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({ type: "error", text: "Kata sandi baru minimal 6 karakter" });
      setIsLoading(false);
      return;
    }

    try {
      await updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });

      setMessage({ type: "success", text: "Kata sandi berhasil diperbarui!" });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Card>
      <CardBody className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Ubah Kata Sandi
        </h3>

        {message && (
          <div
            className={`p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 border border-green-200 text-green-800"
                : "bg-red-50 border border-red-200 text-red-800"
            }`}>
            <div className="flex items-center space-x-2">
              <Icon
                icon={
                  message.type === "success"
                    ? "lucide:check-circle"
                    : "lucide:alert-circle"
                }
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">{message.text}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <Input
              type={showPassword.current ? "text" : "password"}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleInputChange}
              label="Kata Sandi Saat Ini"
              placeholder="Masukkan kata sandi saat ini"
              variant="bordered"
              className="w-full"
              endContent={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="focus:outline-none">
                  <Icon
                    icon={
                      showPassword.current ? "lucide:eye-off" : "lucide:eye"
                    }
                    className="w-4 h-4 text-gray-500"
                  />
                </button>
              }
              classNames={{
                input: "focus:outline-none",
                inputWrapper:
                  "focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-gray-900",
              }}
            />
          </div>

          {/* New Password */}
          <div>
            <Input
              type={showPassword.new ? "text" : "password"}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              label="Kata Sandi Baru"
              placeholder="Masukkan kata sandi baru (min. 6 karakter)"
              variant="bordered"
              className="w-full"
              endContent={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("new")}
                  className="focus:outline-none">
                  <Icon
                    icon={showPassword.new ? "lucide:eye-off" : "lucide:eye"}
                    className="w-4 h-4 text-gray-500"
                  />
                </button>
              }
              classNames={{
                input: "focus:outline-none",
                inputWrapper:
                  "focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-gray-900",
              }}
            />
          </div>

          {/* Confirm New Password */}
          <div>
            <Input
              type={showPassword.confirm ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              label="Konfirmasi Kata Sandi Baru"
              placeholder="Konfirmasi kata sandi baru"
              variant="bordered"
              className="w-full"
              endContent={
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirm")}
                  className="focus:outline-none">
                  <Icon
                    icon={
                      showPassword.confirm ? "lucide:eye-off" : "lucide:eye"
                    }
                    className="w-4 h-4 text-gray-500"
                  />
                </button>
              }
              classNames={{
                input: "focus:outline-none",
                inputWrapper:
                  "focus-within:ring-2 focus-within:ring-gray-900 focus-within:border-gray-900",
              }}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              variant="solid"
              className="px-6 py-2 bg-gray-900 text-white">
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Icon
                    icon="lucide:loader-2"
                    className="w-4 h-4 animate-spin"
                  />
                  <span>Memperbarui...</span>
                </div>
              ) : (
                "Perbarui Kata Sandi"
              )}
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

export default PasswordForm;
