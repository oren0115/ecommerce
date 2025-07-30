import { Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/userLayout";
import AuthLayout from "./layouts/authLayout";
import AdminLayout from "./layouts/adminLayouts";

// User Pages
import Home from "./pages/user/Home/Home";
import Shop from "./pages/user/Shop/Shop";
import ProductDetailPage from "./pages/user/Shop/ProductDetail/ProductDetail";
import CategoryPage from "./pages/user/Shop/CategoryPage";
import Categories from "./pages/user/Shop/Categories";
import Contact from "./pages/user/Contact/Contact";
import Blog from "./pages/user/Blog/Blog";
import BlogDetail from "./pages/user/Blog/BlogDetail";
import Cart from "./pages/user/Cart/Cart";
import Orders from "./pages/user/Shop/Order/Orders";
import OrderDetail from "./pages/user/Shop/Order/OrderDetail";
import Profile from "./pages/user/Profile/Profile";
import PaymentStatus from "./pages/user/Shop/Payment/PaymentStatus";

// Auth Pages
import Login from "./pages/auth/Login/Login";
import Register from "./pages/auth/Register/Register";
import ForgotPassword from "./pages/auth/ForgotPassword/ForgotPassword";

// Admin Pages
import Dashboard from "./components/admin/dashboard/Dashboard";
import CategoryManagement from "./pages/admin/CategoryManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import ProductManagement from "./pages/admin/ProductsManagement";
import BlogManagement from "./pages/admin/BlogManagement";
import UserManagement from "./components/admin/userManagement/userManagement";
import ReportManagement from "./components/admin/reportManagement/ReportManagement";
import Settings from "./components/admin/settings/Settings";
import PromotionalCarouselManagement from "./pages/admin/PromotionalCarouselManagement";

import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* User Routes */}
      <Route element={<UserLayout />}>
        <Route element={<Home />} path="/" />
        <Route element={<Home />} path="/home" />
        <Route element={<Shop />} path="/shop" />
        <Route element={<Categories />} path="/categories" />
        <Route element={<CategoryPage />} path="/category/:slug" />
        <Route element={<ProductDetailPage />} path="/shop/product/:id" />
        <Route element={<Contact />} path="/contact" />
        <Route element={<Blog />} path="/blog" />
        <Route element={<BlogDetail />} path="/blog/:slug" />
        <Route
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
          path="/cart"
        />
        <Route
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
          path="/orders"
        />
        <Route
          element={
            <ProtectedRoute>
              <OrderDetail />
            </ProtectedRoute>
          }
          path="/orders/:id"
        />
        <Route
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
          path="/profile"
        />
        <Route element={<PaymentStatus />} path="/payment/status" />
        <Route element={<PaymentStatus />} path="/payment/success" />
        <Route element={<PaymentStatus />} path="/payment/error" />
        <Route element={<PaymentStatus />} path="/payment/pending" />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route
          element={
            <ProtectedRoute requireAuth={false}>
              <Login />
            </ProtectedRoute>
          }
          path="/auth/login"
        />
        <Route
          element={
            <ProtectedRoute requireAuth={false}>
              <Register />
            </ProtectedRoute>
          }
          path="/auth/register"
        />
        <Route
          element={
            <ProtectedRoute requireAuth={false}>
              <ForgotPassword />
            </ProtectedRoute>
          }
          path="/auth/forgot-password"
        />
      </Route>

      {/* Admin Routes */}
      <Route
        element={
          <ProtectedRoute requireAuth={true} requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
        <Route element={<Dashboard />} path="/admin/dashboard" />
        <Route element={<CategoryManagement />} path="/admin/categories" />
        <Route element={<OrderManagement />} path="/admin/orders" />
        <Route element={<ProductManagement />} path="/admin/products" />
        <Route element={<BlogManagement />} path="/admin/blog" />
        <Route element={<UserManagement />} path="/admin/users" />
        <Route element={<ReportManagement />} path="/admin/reports" />
        <Route element={<Settings />} path="/admin/settings" />
        <Route
          element={<PromotionalCarouselManagement />}
          path="/admin/promotional-carousel"
        />
      </Route>
    </Routes>
  );
}

export default App;
