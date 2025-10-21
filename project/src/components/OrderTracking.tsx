import { X, Search, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface OrderTrackingProps {
  isOpen: boolean;
  onClose: () => void;
}

interface OrderWithItems {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  notes: string;
  created_at: string;
  items: {
    weapon_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }[];
}

export default function OrderTracking({ isOpen, onClose }: OrderTrackingProps) {
  const [dni, setDni] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [searchType, setSearchType] = useState<'dni' | 'order'>('dni');
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSearched(true);
    setOrders([]);

    try {
      let ordersData;

      if (searchType === 'order') {
        const { data, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('order_number', orderNumber)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        ordersData = data;

        if (!ordersData || ordersData.length === 0) {
          setError('No se encontró ningún pedido con ese número de orden');
          setLoading(false);
          return;
        }
      } else {
        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('dni', dni)
          .maybeSingle();

        if (!customer) {
          setError('No se encontraron pedidos asociados a este DNI');
          setLoading(false);
          return;
        }

        const { data, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('customer_id', customer.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        ordersData = data;
      }

      if (!ordersData || ordersData.length === 0) {
        setError('No se encontraron pedidos');
        setLoading(false);
        return;
      }

      const ordersWithItems = await Promise.all(
        ordersData.map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('weapon_id, quantity, unit_price, subtotal')
            .eq('order_id', order.id);

          const itemsWithNames = await Promise.all(
            (items || []).map(async (item) => {
              const { data: weapon } = await supabase
                .from('weapons')
                .select('name')
                .eq('id', item.weapon_id)
                .single();

              return {
                weapon_name: weapon?.name || 'Desconocido',
                quantity: item.quantity,
                unit_price: item.unit_price,
                subtotal: item.subtotal,
              };
            })
          );

          return {
            ...order,
            items: itemsWithNames,
          };
        })
      );

      setOrders(ordersWithItems);
    } catch (err: any) {
      setError(err.message || 'Error al buscar pedidos');
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pendiente':
        return {
          icon: Clock,
          text: 'Pendiente',
          color: 'text-amber-600',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
        };
      case 'en_proceso':
        return {
          icon: Package,
          text: 'En Proceso',
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
        };
      case 'aprobado':
        return {
          icon: CheckCircle,
          text: 'Aprobado',
          color: 'text-green-600',
          bg: 'bg-green-50',
          border: 'border-green-200',
        };
      case 'rechazado':
        return {
          icon: AlertCircle,
          text: 'Rechazado',
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
        };
      default:
        return {
          icon: Package,
          text: status,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
        };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-4xl w-full my-8">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-2xl font-bold">Seguimiento de Pedidos</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSearch} className="mb-6">
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setSearchType('dni')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  searchType === 'dni'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Buscar por DNI
              </button>
              <button
                type="button"
                onClick={() => setSearchType('order')}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors ${
                  searchType === 'order'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Buscar por Número de Orden
              </button>
            </div>

            {searchType === 'dni' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingresa tu DNI para consultar tus pedidos
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    pattern="[0-9]{8}"
                    maxLength={8}
                    required
                    placeholder="Número de DNI (8 dígitos)"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Buscar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingresa el número de orden para consultar tu pedido
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                    placeholder="SUCAMEC-XXXXXXXXX-XXXXX"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white font-semibold px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Buscar
                  </button>
                </div>
              </div>
            )}
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-12">
              <p className="text-gray-600">Buscando pedidos...</p>
            </div>
          )}

          {!loading && searched && orders.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-slate-900 mb-4">
                Se encontraron {orders.length} pedido(s)
              </h3>

              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const StatusIcon = statusInfo.icon;

                return (
                  <div
                    key={order.id}
                    className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Número de Orden</p>
                        <p className="text-lg font-bold text-slate-900">{order.order_number}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusInfo.bg} ${statusInfo.border} border`}>
                        <StatusIcon className={`w-5 h-5 ${statusInfo.color}`} />
                        <span className={`font-semibold ${statusInfo.color}`}>{statusInfo.text}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Fecha de Pedido</p>
                      <p className="text-gray-900">
                        {new Date(order.created_at).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mb-4">
                      <p className="font-semibold text-gray-900 mb-3">Artículos:</p>
                      <ul className="space-y-2">
                        {order.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-700">
                              {item.weapon_name} x {item.quantity}
                            </span>
                            <span className="font-medium text-slate-900">
                              S/ {item.subtotal.toFixed(2)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {order.notes && (
                      <div className="bg-gray-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-600 mb-1">Notas:</p>
                        <p className="text-sm text-gray-900">{order.notes}</p>
                      </div>
                    )}

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 font-medium">Total:</span>
                        <span className="text-2xl font-bold text-slate-900">
                          S/ {order.total_amount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
