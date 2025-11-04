export interface CartItem {
  menu_id: string;
  menu_name: string;
  price: number;
  quantity: number;
  image: File | null | string;
}
