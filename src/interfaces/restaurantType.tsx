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
