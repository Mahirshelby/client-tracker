export type Client = {
  id: number;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  tags: string[];
};

export type ClientList = {
  items: Client[];
  total: number;
  page: number;
  totalPages: number;
};

export type ClientInput = {
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  tags?: string[];
};
