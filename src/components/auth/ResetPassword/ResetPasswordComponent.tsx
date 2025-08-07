import { Button, Form, Input } from "@heroui/react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "../../../api/api";

function ResetPasswordComponent() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = searchParams.get("token");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      setIsLoading(false);
      return;
    }

    try {
      await authAPI.resetPassword({ token, newPassword });
      setSuccess("Password reset successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/auth/login");
      }, 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.detail?.message || "Failed to reset password"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-[400px] h-[600px] p-8 bg-white/90 border border-gray-100 rounded-2xl shadow-none flex flex-col justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Invalid Reset Link
            </h1>
            <p className="text-gray-600 mb-6">
              The password reset link is invalid or has expired. Please request
              a new password reset.
            </p>
            <Link
              to="/auth/forgot-password"
              className="inline-block bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
              Request New Reset Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[400px] h-[600px] p-8 bg-white/90 border border-gray-100 rounded-2xl shadow-none flex flex-col">
        {/* Header */}
        <div className="text-center flex-shrink-0">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">Enter your new password below</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded text-red-700 text-sm flex-shrink-0">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 border-l-4 border-gray-400 text-gray-900 text-sm flex-shrink-0">
            {success}
          </div>
        )}

        {/* Form */}
        <Form
          className="flex-1 flex flex-col justify-center space-y-5"
          onSubmit={onSubmit}>
          <Input
            isRequired
            name="newPassword"
            label="New Password"
            labelPlacement="outside"
            placeholder="Enter your new password"
            type="password"
            variant="bordered"
            size="lg"
            classNames={{
              inputWrapper: "border-gray-200 hover:border-gray-300",
              input: "focus:ring-0 focus:outline-none",
            }}
          />
          <Input
            isRequired
            name="confirmPassword"
            label="Confirm New Password"
            labelPlacement="outside"
            placeholder="Confirm your new password"
            type="password"
            variant="bordered"
            size="lg"
            classNames={{
              inputWrapper: "border-gray-200 hover:border-gray-300",
              input: "focus:ring-0 focus:outline-none",
            }}
          />
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gray-900 text-white font-medium rounded-lg py-2 mt-2 hover:bg-gray-800 transition-all duration-150 shadow-none"
            isLoading={isLoading}
            disabled={isLoading}>
            {isLoading ? "Resetting..." : "Reset Password"}
          </Button>
        </Form>

        {/* Footer */}
        <div className="text-center space-y-2 mt-4 flex-shrink-0">
          <p className="text-sm text-gray-600">
            Remember your password?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-gray-900 underline hover:text-gray-700">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordComponent;
