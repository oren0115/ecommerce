import { Button, Form, Input } from "@heroui/react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "../../../api/api";

function ForgotPasswordComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    try {
      await authAPI.forgotPassword({ email });
      setSuccess(
        "Password reset email sent successfully. Please check your email."
      );
    } catch (err: any) {
      setError(
        err.response?.data?.error?.detail?.message ||
          "Failed to send reset email"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[400px] h-[600px] p-8 bg-white/90 border border-gray-100 rounded-2xl shadow-none flex flex-col">
        {/* Header */}
        <div className="text-center flex-shrink-0">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded text-red-700 text-sm flex-shrink-0">
            {error}
          </div>
        )}
        {success && (
          <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded text-green-700 text-sm flex-shrink-0">
            {success}
          </div>
        )}
        {/* Form */}
        <Form
          className="flex-1 flex flex-col justify-center space-y-5"
          onSubmit={onSubmit}>
          <Input
            isRequired
            name="email"
            label="Email address"
            labelPlacement="outside"
            placeholder="you@example.com"
            type="email"
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
            {isLoading ? "Sending..." : "Send Reset Link"}
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
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/auth/register"
              className="font-medium text-gray-900 underline hover:text-gray-700">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordComponent;
