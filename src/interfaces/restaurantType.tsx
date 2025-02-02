export interface menuItem {
  name: string;
  description: string;
  category_id: number;
  category: string;
  price: number;
  image: File | null | string;
  id: number;
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
  item_picture: string;
  quantity: number;
  menu_id: number;
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
  location: string;
}

export interface orderType {
  //this is for the order route in user dashboard. It's the type the userOrders state is set to
  id: number;
  items: { menu_id: number; quantity: number; menu_name: string }[];
  status: string;
  total: number;
  restaurant_name: string;
  location: string;
  user_phoneNumber: string;
}
