export interface menuItem {
  name: string;
  description: string;
  category_id: number;
  category: string;
  price: number;
  image: File | null;
  id: number;
}

export interface category {
  id: number;
  name: string;
}
