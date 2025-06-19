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
  contacts: {
    current_page: number;
    data: Contact[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
  message: string;
}
