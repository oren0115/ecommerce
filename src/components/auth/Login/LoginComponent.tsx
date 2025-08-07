import { Button, Form, Input } from "@heroui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

function LoginComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, resendActivation } = useAuth();
  const [remember, setRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [unactivatedEmail, setUnactivatedEmail] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await login({ email, password });
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err: any) {
      // Check if it's an unactivated account error
      if (
        err.message.includes("not activated") ||
        err.message.includes("activation")
      ) {
        setUnactivatedEmail(email);
        setError(
          "Account is not activated. Please check your email for activation link or request a new one."
        );
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendActivation = async () => {
    if (!unactivatedEmail) return;

    setIsResending(true);
    setError("");

    try {
      await resendActivation(unactivatedEmail);
      setError("Activation email sent successfully! Please check your inbox.");
      setUnactivatedEmail("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[400px] h-[750px] p-8 bg-white/90 border border-gray-100 rounded-2xl shadow-none flex flex-col">
        {/* Header */}
        <div className="text-center flex-shrink-0">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Welcome back
          </h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-2 flex-shrink-0">
          <Link
            to="/auth/login"
            className={`flex-1 text-center py-2 px-4 rounded-lg font-medium transition-all duration-200 ${location.pathname === "/auth/login" ? "bg-black  text-white border border-gray-200" : "text-gray-600 hover:text-gray-900"}`}>
            Sign In
          </Link>
          <Link
            to="/auth/register"
            className={`flex-1 text-center py-2 px-4 rounded-lg font-medium transition-all duration-200 ${location.pathname === "/auth/register" ? "bg-white text-gray-900 border border-gray-200" : "text-gray-600 hover:text-gray-900"}`}>
            Sign Up
          </Link>
        </div>
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded text-red-700 text-sm flex-shrink-0">
            <div className="mb-2">{error}</div>
            {unactivatedEmail && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <Button
                  onClick={handleResendActivation}
                  isLoading={isResending}
                  variant="light"
                  size="sm"
                  className="text-red-700 hover:text-red-800">
                  {isResending ? "Sending..." : "Resend Activation Email"}
                </Button>
              </div>
            )}
          </div>
        )}
        {/* Login Form */}
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
          <Input
            isRequired
            name="password"
            label="Password"
            labelPlacement="outside"
            placeholder="••••••••"
            type="password"
            variant="bordered"
            size="lg"
            classNames={{
              inputWrapper: "border-gray-200 hover:border-gray-300",
              input: "focus:ring-0 focus:outline-none",
            }}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none text-gray-600 text-sm">
              <input
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                type="checkbox"
                className="accent-gray-900 w-4 h-4 rounded border-gray-300"
              />
              Remember me
            </label>
            <Link
              to="/auth/forgot-password"
              className="text-sm text-gray-500 hover:text-gray-900 transition">
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gray-900 text-white font-medium rounded-lg py-2 mt-2 hover:bg-gray-800 transition-all duration-150 shadow-none"
            isLoading={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default LoginComponent;
