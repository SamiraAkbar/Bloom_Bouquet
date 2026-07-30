export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
  address?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category?: string; // keeping for backward compatibility
  categories?: string[];
  imageUrl: string;
  inStock: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled' | 'cancel_requested';
  shippingAddress?: string;
  city?: string;
  postalCode?: string;
  phone?: string;
  createdAt: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
}
