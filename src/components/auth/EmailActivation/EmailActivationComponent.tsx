import { Button } from "@heroui/react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";

function EmailActivationComponent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { activateAccount, resendActivation } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activationToken, setActivationToken] = useState("");

  const userData = location.state?.userData;
  const tokenFromUrl = searchParams.get("token");

  useEffect(() => {
    if (tokenFromUrl) {
      setActivationToken(tokenFromUrl);
      handleActivation(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleActivation = async (token: string) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      await activateAccount(token);
      setSuccess("Account activated successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/auth/login", { replace: true });
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendActivation = async () => {
    if (!userData?.email) {
      setError("Email not found. Please register again.");
      return;
    }

    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      await resendActivation(userData.email);
      setSuccess(
        "Activation email sent successfully! Please check your inbox."
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsResending(false);
    }
  };

  const handleManualActivation = async () => {
    if (!activationToken.trim()) {
      setError("Please enter a valid activation token.");
      return;
    }
    await handleActivation(activationToken.trim());
  };

  if (!userData && !tokenFromUrl) {
    navigate("/auth/register");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white/90 border border-gray-200 rounded-2xl shadow-sm flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Activate Your Account
          </h1>
          <p className="text-gray-600 text-sm">
            {userData
              ? `We've sent an activation link to ${userData.email}`
              : "Enter your activation token below"}
          </p>
        </div>

        {success && (
          <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded text-green-700 text-sm mb-6">
            {success}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded text-red-700 text-sm mb-6">
            {error}
          </div>
        )}

        {!tokenFromUrl && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Activation Token
            </label>
            <input
              type="text"
              value={activationToken}
              onChange={(e) => setActivationToken(e.target.value)}
              placeholder="Enter your activation token"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button
              onClick={handleManualActivation}
              isLoading={isLoading}
              className="w-full mt-3 bg-blue-600 hover:bg-blue-700 text-white">
              {isLoading ? "Activating..." : "Activate Account"}
            </Button>
          </div>
        )}

        {userData && (
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-4">
              Didn't receive the email? Check your spam folder or request a new
              one.
            </p>
            <Button
              onClick={handleResendActivation}
              isLoading={isResending}
              variant="light"
              className="text-blue-600 hover:text-blue-700">
              {isResending ? "Sending..." : "Resend Activation Email"}
            </Button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/auth/login"
            className="text-sm text-gray-600 hover:text-gray-800 underline">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default EmailActivationComponent;
