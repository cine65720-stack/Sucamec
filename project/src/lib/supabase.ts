import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WeaponCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Weapon {
  id: string;
  category_id: string;
  name: string;
  caliber: string;
  manufacturer: string;
  image_url: string;
  description: string;
  price: number;
  stock: number;
  specifications: {
    peso?: string;
    capacidad?: string;
    longitud?: string;
  };
  required_documents: string[];
  created_at: string;
}

export interface Customer {
  id: string;
  full_name: string;
  dni: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

export interface Order {
  id: string;
  customer_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  weapon_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  created_at: string;
}
