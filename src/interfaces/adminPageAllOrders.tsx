export interface Order {
  id: number;
  user_id: string;
  restaurant_id: string;
  driver_id: string;
  items: Item[];
  total: string;
  status: string;
  code: string;
  customer_location: string;
  user: User;
  driver: User | null;
}

export interface Item {
  menu_id: number;
  quantity: number;
  menu_name: string;
  menu_price: number;
  menu_picture: string;
}

export interface Driver {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  status: string;
  account_type: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  status: string;
  account_type: string;
}
