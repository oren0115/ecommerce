import { Button, Form, Input } from "@heroui/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

function RegisterComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register } = useAuth();
  const [agree, setAgree] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agree) {
      setError("Please agree to the terms and conditions.");
      return;
    }

    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const fullname = formData.get("fullname") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await register({ fullname, email, password });
      const from = location.state?.from?.pathname || "/";
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-[400px] min-h-[480px] space-y-8 p-8 bg-white/90 border border-gray-100 rounded-2xl shadow-none flex flex-col justify-center">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            Create account
          </h1>
          <p className="text-gray-600">Start your journey with us today</p>
        </div>
        {/* Tab Navigation */}
        <div className="flex bg-gray-100 p-1 rounded-xl mb-2">
          <Link
            to="/auth/login"
            className={`flex-1 text-center py-2 px-4 rounded-lg font-medium transition-all duration-200 ${location.pathname === "/auth/login" ? "bg-black  text-white border border-gray-200" : "text-gray-600 hover:text-gray-900"}`}>
            Sign In
          </Link>
          <Link
            to="/auth/register"
            className={`flex-1 text-center py-2 px-4 rounded-lg font-medium transition-all duration-200 ${location.pathname === "/auth/register" ? "bg-black  text-white border border-gray-200" : "text-gray-600 hover:text-gray-900"}`}>
            Sign Up
          </Link>
        </div>
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
        {/* Register Form */}
        <Form className="space-y-5" onSubmit={onSubmit}>
          <Input
            isRequired
            name="fullname"
            label="Full name"
            labelPlacement="outside"
            placeholder="John Doe"
            type="text"
            variant="bordered"
            size="lg"
            classNames={{
              inputWrapper: "border-gray-200 hover:border-gray-300",
              input: "focus:ring-0 focus:outline-none",
            }}
          />
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
          <Input
            isRequired
            name="confirmPassword"
            label="Confirm password"
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
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="accent-gray-900 w-4 h-4 rounded border-gray-300"
            />
            <span className="text-gray-600 text-sm select-none">
              I agree to the{" "}
              <a href="#" className="underline hover:text-gray-900">
                terms & conditions
              </a>
            </span>
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full bg-gray-900 text-white font-medium rounded-lg py-2 mt-2 hover:bg-gray-800 transition-all duration-150 shadow-none"
            isLoading={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default RegisterComponent;
