import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// User types
export interface User {
  _id: string;
  fullname: string;
  email: string;
  role: "user" | "admin";
  shippingAddress?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  city?: string;
  postalCode?: string;
  avatar?: string;
  avatarPublicId?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  fullname: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    type: string;
    detail: {
      message: string;
    };
  };
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<any>;
}

// Category types
export interface Category {
  _id: string;
  name: string;
  description?: string;
  thumbnailImage?: string;
  thumbnailImagePublicId?: string;
  productsCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Size types
export interface Size {
  _id: string;
  name: string;
  code: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSize {
  _id: string;
  productId: string;
  sizeId: Size;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSizeData {
  name: string;
  code: string;
  order?: number;
}

export interface UpdateSizeData extends Partial<CreateSizeData> {
  _id: string;
  isActive?: boolean;
}

export interface ProductSizeData {
  sizeId: string;
  stock: number;
}

// Product types
export interface ProductImage {
  url: string;
  publicId?: string;
  order: number;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  description?: string;
  detail?: string;
  images: ProductImage[];
  categoryIds: Category[];
  stock: number;
  discountPercent: number;
  discountedPrice: number;
  rating: number;
  ratingCount: number;
  salesCount: number;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  attributes?: Record<string, any>;
}

export interface CreateProductData {
  name: string;
  price: number;
  description?: string;
  detail?: string;
  images: ProductImage[];
  categoryIds: string[];
  stock: number;
  discountPercent: number;
  tags?: string[];
  attributes?: Record<string, any>;
}

export interface UpdateProductData extends Partial<CreateProductData> {
  _id: string;
}

// Cart types
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  discountedPrice: number;
  discountPercent: number;
  quantity: number;
  imageUrl: string;
  stock: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  total: number;
}

// Wishlist types
export interface WishlistItem {
  _id: string;
  userId: string;
  productId: Product;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWishlistData {
  productId: string;
}

// Order types
export interface OrderItem {
  _id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  imageUrl: string;
  totalPrice: number;
}

export interface CreateOrderData {
  shippingAddress: string;
  township?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  deliveryDate: string;
  paymentType: "cod" | "bank_transfer" | "credit_card" | "e_wallet" | "qris";
  deliveryType: "standard" | "express";
  totalPrice: number;
  products: Array<{ productId: string; quantity: number }>;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customerId: User;
  shippingAddress: string;
  township?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  orderDate: string;
  deliveryDate: string;
  paymentType: "cod" | "bank_transfer" | "credit_card" | "e_wallet" | "qris";
  deliveryType: "standard" | "express";
  totalPrice: number;
  status:
    | "pending"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "paid"
    | "unpaid";
  products: OrderItem[];
  paymentStatus?: "pending" | "paid" | "failed" | "expired";
  midtransOrderId?: string;
  midtransToken?: string;
  paymentUrl?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  // New fields for enhanced payment support
  paymentMethod?: string;
  vaNumbers?: Array<{
    bank: string;
    va_number: string;
  }>;
  qrString?: string;
  qrCode?: string;
}

// Blog types
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: {
    url: string;
    publicId?: string;
  };
  author: User;
  status: "draft" | "published";
  tags: string[];
  category?: string;
  readTime: number;
  viewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords: string[];
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: {
    url: string;
    publicId?: string;
  };
  status?: "draft" | "published";
  tags?: string[];
  category?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  _id: string;
}

export interface BlogStats {
  overview: {
    totalBlogs: number;
    publishedBlogs: number;
    draftBlogs: number;
    totalViews: number;
    avgReadTime: number;
  };
  categories: Array<{
    _id: string;
    count: number;
  }>;
  tags: Array<{
    _id: string;
    count: number;
  }>;
}

// Report Types
export interface SalesAnalytics {
  period: number;
  salesByDay: Array<{
    _id: string;
    totalSales: number;
    orderCount: number;
  }>;
  topProducts: Array<{
    _id: string;
    name: string;
    totalSold: number;
    totalRevenue: number;
  }>;
  salesByCategory: Array<{
    _id: string;
    categoryName: string;
    totalSales: number;
    orderCount: number;
  }>;
  paymentMethods: Array<{
    _id: string;
    totalSales: number;
    orderCount: number;
  }>;
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    pendingOrders: number;
  };
}

export interface UserAnalytics {
  period: number;
  registrationsByDay: Array<{
    _id: string;
    count: number;
  }>;
  topCustomers: Array<{
    customerName: string;
    email: string;
    totalSpent: number;
    orderCount: number;
  }>;
  summary: {
    totalUsers: number;
    activeUsers: number;
    newUsers: number;
  };
}

export interface ProductAnalytics {
  period: number;
  productPerformance: Array<{
    _id: string;
    name: string;
    price: number;
    stock: number;
    salesCount: number;
    rating: number;
    totalRevenue: number;
  }>;
  categoryPerformance: Array<{
    _id: string;
    name: string;
    productCount: number;
    totalStock: number;
    avgPrice: number;
  }>;
  lowStockProducts: Array<{
    _id: string;
    name: string;
    stock: number;
    price: number;
  }>;
  summary: {
    totalProducts: number;
    totalStock: number;
    avgPrice: number;
    lowStockCount: number;
  };
}

export interface OrderAnalytics {
  period: number;
  ordersByStatus: Array<{
    _id: string;
    count: number;
    totalValue: number;
  }>;
  ordersByDay: Array<{
    _id: string;
    count: number;
    totalValue: number;
  }>;
  avgOrderValue: Array<{
    _id: string;
    avgValue: number;
    count: number;
  }>;
  summary: {
    totalOrders: number;
    totalValue: number;
    avgOrderValue: number;
  };
}

export interface DashboardOverview {
  today: {
    orders: number;
    revenue: number;
  };
  month: {
    orders: number;
    revenue: number;
  };
  year: {
    orders: number;
    revenue: number;
  };
  counts: {
    users: number;
    products: number;
    orders: number;
    pendingOrders: number;
  };
}

// Promotional Carousel Types
export interface PromotionalSlide {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  date?: string;
  image: {
    url: string;
    publicId?: string;
  };
  buttonText: string;
  backgroundColor: string;
  textColor: string;
  status: "active" | "inactive";
  order: number;
  linkUrl?: string;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePromotionalSlideData {
  title: string;
  subtitle: string;
  description: string;
  date?: string;
  image: {
    url: string;
    publicId?: string;
  };
  buttonText: string;
  backgroundColor: string;
  textColor: string;
  status?: "active" | "inactive";
  order?: number;
  linkUrl?: string;
  startDate?: string;
  endDate?: string;
}

export interface UpdatePromotionalSlideData
  extends Partial<CreatePromotionalSlideData> {
  _id: string;
}
