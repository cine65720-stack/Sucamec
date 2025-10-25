import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AdminUser {
  id: string;
  username: string;
  role: 'administrator' | 'logistic';
  full_name: string;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: string;
  total_amount: number;
  notes?: string;
  documents_validated: boolean;
  stock_validated: boolean;
  documents_validator_id?: string;
  stock_validator_id?: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
  order_items?: OrderItem[];
  order_documents?: OrderDocument[];
}

export interface Customer {
  id: string;
  full_name: string;
  dni: string;
  email: string;
  phone?: string;
  address?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  weapon_id: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  weapon?: Weapon;
}

export interface Weapon {
  id: string;
  name: string;
  caliber: string;
  manufacturer: string;
  price: number;
  stock: number;
  required_documents: string[];
}

export interface OrderDocument {
  id: string;
  order_id: string;
  document_type: string;
  file_url: string;
  file_name: string;
  uploaded_at: string;
}

export interface OrderValidation {
  id: string;
  order_id: string;
  admin_user_id: string;
  validation_type: 'documents' | 'stock';
  status: 'approved' | 'rejected';
  notes?: string;
  validated_at: string;
}

export const loginAdmin = async (username: string, password: string): Promise<AdminUser | null> => {
  const { data, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .eq('password_hash', password)
    .maybeSingle();

  if (error || !data) {
    console.error('Login error:', error);
    return null;
  }

  return data as AdminUser;
};

export const getOrders = async (): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:customers(*),
      order_items(
        *,
        weapon:weapons(*)
      ),
      order_documents(*)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data as Order[];
};

export const updateOrderValidation = async (
  orderId: string,
  validationType: 'documents' | 'stock',
  status: 'approved' | 'rejected',
  adminUserId: string,
  notes?: string
): Promise<boolean> => {
  const updateField = validationType === 'documents' ? 'documents_validated' : 'stock_validated';
  const validatorField = validationType === 'documents' ? 'documents_validator_id' : 'stock_validator_id';

  const { error: orderError } = await supabase
    .from('orders')
    .update({
      [updateField]: status === 'approved',
      [validatorField]: adminUserId,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (orderError) {
    console.error('Error updating order:', orderError);
    return false;
  }

  const { error: validationError } = await supabase
    .from('order_validations')
    .insert({
      order_id: orderId,
      admin_user_id: adminUserId,
      validation_type: validationType,
      status,
      notes
    });

  if (validationError) {
    console.error('Error creating validation:', validationError);
    return false;
  }

  return true;
};

export const updateOrderStatus = async (orderId: string, newStatus: string): Promise<boolean> => {
  const { error } = await supabase
    .from('orders')
    .update({
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return false;
  }

  return true;
};
