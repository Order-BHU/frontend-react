import { MenuItem } from "@/types/shared";
// Re-export shared types for backward compatibility
export type {
  MenuItem as menuItem,
  Menu as menu,
  Category as category,
} from "@/types/shared";

// Re-export more shared types
export type {
  SingularCartItem as singularCartItem,
  Cart as cartItem,
  PaymentVerification as paymentVerifyType,
} from "@/types/shared";

export interface tempapiMenu {
  //this type is for the restaurant menu thingy in the backend for me to get the api category to actually show what it's supposed to
  menus: MenuItem[];
}

// Re-export order types
export type {
  BaseOrder as orderType,
  OrderHistory as orderHistoryType,
} from "@/types/shared";

// Re-export remaining types
export type {
  RestaurantMetrics as restaurantMetric,
  Transaction as transactionType,
} from "@/types/shared";
