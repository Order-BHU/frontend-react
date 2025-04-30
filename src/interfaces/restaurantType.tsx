export interface menuItem {
  name: string;
  description: string;
  category_id: number;
  category: string;
  price: number;
  image: File | null | string;
  id: number;
  is_available: "1" | "0";
  restaurant_id: string;
}

export interface menu {
  //I apologize for the weird naming conventions(past me was worse in react than i am now) but this is for the raw api for menu items. Not the items themselves, but the array that holds the categories that holds the items
  name: string;
  id: number;
  menus: menuItem[];
}

export interface category {
  id: number;
  name: string;
}

export interface tempapiMenu {
  //this type is for the restaurant menu thingy in the backend for me to get the api category to actually show what it's supposed to
  menus: menuItem[];
}
export interface singularCartItem {
  item_description: string;
  item_name: string;
  item_picture: File | null | string;
  item_price: number;
  menu_id: number;
  is_available: "1" | "0";
}
export interface cartItem {
  items: singularCartItem[];
  restaurant_id: number;
  total: number;
}

export interface checkoutType {
  items: { menu_id: number; quantity: number; menu_name: string }[];
  restaurant_id: number;
  total: number;
  location: string | null;
  reference: string;
}

export interface orderType {
  //this is for the order route in user dashboard. It's the type the userOrders state is set to
  id: number;
  items: {
    image: string;
    menu_id: number;
    quantity: number;
    menu_name: string;
    menu_price: number;
    item_name: string /*man... he changed the names without telling, and now idk what to add or remove. bear with me here, this is for pending orders but idk if the change carries over to all order types */;
  }[];
  status: string;
  total: number;
  order_code: string;
  restaurant_name: string;
  location: string;
  user_phoneNumber: string;
  phone_number_type: string;
  user_name: string;
  order_id: number; //honestly, man, idek why this is here. It's to complete the checkout order for the drivers, but idk we couldn't just use the id. DO NOT FUCKING REMOVE ANYTHING, it's from the backend and it's very important istg.

  driver_name: string;
  driver_profile_photo: string;
  driver_number: string;
}

export interface orderHistoryType {
  order_id: number;
  restaurant_name: string;
  user_name: string;
  user_phoneNumber: string;
  location: string;
  items: {
    menu_id: number;
    image: string;
    quantity: number;
    menu_name: string;
    menu_price: number;
    is_available: string; // If this should be a boolean, convert it to `boolean` in your code.
    menu_picture: string;
    item_name: string;
  }[];
  total: string;
  order_date: string | null;
}

export interface restaurantMetric {
  average_order_value: number;
  id: number;
  name: string;
  pending_orders: string;
  total_orders: string;
  total_revenue: number;
  wallet_balance: string;
}

export interface transactionType {
  id: number;
  amount: string; // If you plan to do calculations, change this to `number`
  created_at: string; // Consider using `Date` if you plan to manipulate dates
  customer_id: string; // If IDs are numbers, change this to `number`
  reference: string;
  restaurant_id: string; // If IDs are numbers, change this to `number`
  status: string; // Add more possible statuses if needed
  type: string; // Assuming only these two types exist
}
