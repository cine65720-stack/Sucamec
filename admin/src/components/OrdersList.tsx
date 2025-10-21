import { Order } from '../lib/supabase';

interface OrdersListProps {
  orders: Order[];
  onSelectOrder: (order: Order) => void;
  userRole: 'administrator' | 'logistic';
}

export default function OrdersList({ orders, onSelectOrder, userRole }: OrdersListProps) {
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="mt-4 text-gray-600">No hay solicitudes para mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const isValidated = userRole === 'administrator' ? order.documents_validated : order.stock_validated;
        const totalWeapons = order.order_items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

        return (
          <div
            key={order.id}
            onClick={() => onSelectOrder(order)}
            className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-white"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Orden #{order.order_number}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    isValidated
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isValidated ? 'Validado' : 'Pendiente'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Cliente</p>
                    <p className="text-sm text-gray-900 font-medium">{order.customer?.full_name}</p>
                    <p className="text-xs text-gray-600">DNI: {order.customer?.dni}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Armas Solicitadas</p>
                    <p className="text-sm text-gray-900 font-medium">{totalWeapons} unidades</p>
                    <p className="text-xs text-gray-600">
                      {order.order_items?.length || 0} tipo(s) de arma
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">Monto Total</p>
                    <p className="text-sm text-gray-900 font-bold">
                      S/ {order.total_amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-600">
                      {new Date(order.created_at).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      order.documents_validated ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-gray-600">Documentos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      order.stock_validated ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className="text-gray-600">Stock</span>
                  </div>
                </div>
              </div>

              <div className="ml-4">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
