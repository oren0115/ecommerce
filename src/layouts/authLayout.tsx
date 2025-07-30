import { Outlet } from "react-router-dom";

const BrandSide = () => (
  <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center">
    <div
      className="absolute inset-0 z-0 bg-cover bg-center "
      style={{ backgroundImage: "url('/images/logo.auth.jpg')" }}
    />
  </div>
);

const FormSide = () => (
  <div className="w-full lg:w-1/2 min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center p-6">
    <div className="w-full max-w-lg min-w-0">
      <Outlet />
    </div>
  </div>
);

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <BrandSide />
      <FormSide />
    </div>
  );
}
