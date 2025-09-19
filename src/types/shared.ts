// Shared types across the application
// Consolidates duplicate interfaces and provides consistent typing

export interface BaseApiResponse {
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// User and Authentication Types
export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  phone_number_type: "whatsapp" | "sms" | "both";
  account_type: "customer" | "restaurant" | "driver" | "admin";
  profile_picture?: string;
  cover_picture?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  phone_number: string;
  phone_number_type: "whatsapp" | "sms" | "both";
  account_type: "customer";
  "g-recaptcha-response": string;
}

export interface OwnerSignupData {
  email: string;
  name?: string;
  password: string;
  phone_number: string;
  phone_number_type: "whatsapp" | "sms" | "both";
  account_type: "restaurant" | "driver";
  owners_name?: string;
  restaurant_name?: string;
  account_no: string;
  bank_code: string;
  bank_name: string;
}

export interface DriverSignupData {
  email: string;
  password: string;
  phone_number: string;
  phone_number_type: "whatsapp" | "sms" | "both";
  account_type: "driver";
  name: string;
  account_no: string;
  bank_code: string;
  bank_name: string;
}

export interface OtpVerification {
  email: string;
  otp: string;
}

// Restaurant and Menu Types
export interface Restaurant {
  id: number;
  name: string;
  logo: string;
  status?: "active" | "inactive";
}

export interface Category {
  id: number;
  name: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category: string;
  price: number;
  image: File | null | string;
  is_available: "1" | "0";
  restaurant_id: string;
}

export interface Menu {
  name: string;
  id: number;
  menus: MenuItem[];
}

export interface CartItem {
  menu_id: string;
  menu_name: string;
  price: number;
  quantity: number;
  image: File | null | string;
}

export interface SingularCartItem {
  item_description: string;
  item_name: string;
  item_picture: File | null | string;
  item_price: number;
  menu_id: number;
  is_available: "1" | "0";
}

export interface Cart {
  items: SingularCartItem[];
  restaurant_id: number;
  total: number;
}

// Order Types
export interface OrderItem {
  menu_id: number;
  image: string;
  quantity: number;
  menu_name: string;
  menu_price: number;
  item_name: string;
  is_available?: string;
  menu_picture?: string;
}

export interface BaseOrder {
  id: number;
  items: OrderItem[];
  status: string;
  total: number;
  order_code: string;
  restaurant_name: string;
  customer_location: string;
  user_phoneNumber: string;
  phone_number_type: string;
  user_name: string;
  order_id: number;
  order_date: string | null;
  user: {
    name: string;
    phone_number: string;
  };
}

export interface CustomerOrder extends BaseOrder {
  // Customer-specific order properties
}

export interface DriverOrder extends BaseOrder {
  driver_name: string;
  driver_profile_photo: string;
  driver_number: string;
  location: string;
}

export interface RestaurantOrder extends BaseOrder {
  // Restaurant-specific order properties
}

export interface OrderHistory {
  order_id: number;
  restaurant_name: string;
  user_name: string;
  user_phoneNumber: string;
  location: string;
  status: string;
  items: OrderItem[];
  total: string;
  order_date: string | null;
}

// Payment Types
export interface PaymentVerification {
  restaurant_id: number;
  reference: string;
}

export interface PaymentDetails {
  amount: number;
  reference: string | null;
}

export interface Subaccount {
  business_name: string;
  account_number: string;
  bank_code: string;
  percentage_charge: number;
}

export interface BankType {
  name: string;
  code: string;
  longcode: string;
  gateway: string;
}

export interface Transaction {
  id: number;
  amount: string;
  created_at: string;
  customer_id: string;
  reference: string;
  restaurant_id: string;
  status: string;
  type: string;
}

// Contact Types
export interface Contact {
  id: number;
  user_id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "unattended" | "sorted";
  created_at: string;
  updated_at: string;
}

export interface ContactsResponse {
  contacts: Contact[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Dashboard and Metrics Types
export interface RestaurantMetrics {
  id: number;
  name: string;
  total_orders: string;
  total_revenue: number;
  status: "active" | "inactive" | null;
}

export interface DashboardData {
  user: User;
  metrics?: {
    total_orders?: number;
    total_revenue?: number;
    pending_orders?: number;
  };
}

// Form Types
export interface ProfileUpdateData {
  profile_picture?: File | null;
  name?: string;
  phone_number_type?: "whatsapp" | "sms";
  cover_picture?: File | null;
  phone_number?: string;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface ContactFormData {
  subject: string;
  message: string;
}

// API Error Types
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Component Props Types
export interface OrderCardProps {
  order: BaseOrder;
  onStatusUpdate?: (orderId: number, status: string, code?: string) => void;
  onAccept?: (orderId: number) => void;
  isLoading?: boolean;
}

export interface CreateUserModalProps {
  isDriver: boolean;
  className?: string;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

// Hook Types
export interface PaymentModalProps {
  amount: number;
  reference: string | null;
}

export interface UsePaymentModalReturn {
  isOpen: boolean;
  paymentDetails: PaymentDetails;
  openModal: (details?: Partial<PaymentDetails>) => void;
  closeModal: () => void;
}

// Status Types
export type OrderStatus = "pending" | "delivering" | "accepted" | "ready" | "history";
export type UserRole = "customer" | "restaurant" | "driver" | "admin";
export type PhoneType = "whatsapp" | "sms" | "both";
export type ContactStatus = "unattended" | "sorted";
