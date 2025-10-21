import { useState } from 'react';
import { AdminUser, Order, updateOrderValidation, updateOrderStatus } from '../lib/supabase';

interface OrderDetailsProps {
  order: Order;
  user: AdminUser;
  onClose: () => void;
  onUpdate: () => void;
}

export default function OrderDetails({ order, user, onClose, onUpdate }: OrderDetailsProps) {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'stock'>('info');

  const handleValidation = async (status: 'approved' | 'rejected') => {
    if (loading) return;

    const validationType = user.role === 'administrator' ? 'documents' : 'stock';
    const confirmMessage = status === 'approved'
      ? `¿Está seguro de aprobar ${validationType === 'documents' ? 'los documentos' : 'el stock'}?`
      : `¿Está seguro de rechazar ${validationType === 'documents' ? 'los documentos' : 'el stock'}?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    setLoading(true);

    try {
      const success = await updateOrderValidation(
        order.id,
        validationType,
        status,
        user.id,
        notes || undefined
      );

      if (success) {
        alert(`Validación ${status === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`);

        if (status === 'rejected') {
          await updateOrderStatus(order.id, 'rechazado');
        } else {
          const orderNeedsApproval = validationType === 'documents'
            ? order.stock_validated
            : order.documents_validated;

          if (orderNeedsApproval) {
            await updateOrderStatus(order.id, 'aprobado');
          }
        }

        onUpdate();
        onClose();
      } else {
        alert('Error al procesar la validación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la validación');
    } finally {
      setLoading(false);
    }
  };

  const isValidated = user.role === 'administrator' ? order.documents_validated : order.stock_validated;

  const requiredDocuments = new Set<string>();
  order.order_items?.forEach(item => {
    if (item.weapon?.required_documents) {
      item.weapon.required_documents.forEach(doc => requiredDocuments.add(doc));
    }
  });

  const uploadedDocTypes = new Set(order.order_documents?.map(doc => doc.document_type) || []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white">Orden #{order.order_number}</h2>
            <p className="text-blue-100 text-sm mt-1">
              {user.role === 'administrator' ? 'Validación de Documentos' : 'Verificación de Stock'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 p-2 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex px-6">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'info'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Información General
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Documentos
            </button>
            <button
              onClick={() => setActiveTab('stock')}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'stock'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Verificación de Stock
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Información del Cliente</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Nombre Completo</p>
                    <p className="font-medium text-gray-900">{order.customer?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">DNI</p>
                    <p className="font-medium text-gray-900">{order.customer?.dni}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Email</p>
                    <p className="font-medium text-gray-900">{order.customer?.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Teléfono</p>
                    <p className="font-medium text-gray-900">{order.customer?.phone || 'No especificado'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-600">Dirección</p>
                    <p className="font-medium text-gray-900">{order.customer?.address || 'No especificada'}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Armas Solicitadas</h3>
                <div className="space-y-3">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{item.weapon?.name}</p>
                          <p className="text-sm text-gray-600">
                            {item.weapon?.caliber} - {item.weapon?.manufacturer}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">x{item.quantity}</p>
                          <p className="text-xs text-gray-600">
                            S/ {item.subtotal.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-blue-600">
                      S/ {order.total_amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Estado de Validación</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-lg ${
                    order.documents_validated ? 'bg-green-50 border border-green-200' : 'bg-gray-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      {order.documents_validated ? (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`font-medium ${
                        order.documents_validated ? 'text-green-900' : 'text-gray-600'
                      }`}>
                        Documentos
                      </span>
                    </div>
                    <p className="text-sm mt-1 ml-7 text-gray-600">
                      {order.documents_validated ? 'Validado' : 'Pendiente'}
                    </p>
                  </div>

                  <div className={`p-3 rounded-lg ${
                    order.stock_validated ? 'bg-green-50 border border-green-200' : 'bg-gray-100'
                  }`}>
                    <div className="flex items-center gap-2">
                      {order.stock_validated ? (
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span className={`font-medium ${
                        order.stock_validated ? 'text-green-900' : 'text-gray-600'
                      }`}>
                        Stock
                      </span>
                    </div>
                    <p className="text-sm mt-1 ml-7 text-gray-600">
                      {order.stock_validated ? 'Verificado' : 'Pendiente'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-900">Documentos Requeridos</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Verifique que todos los documentos necesarios estén presentes y sean válidos
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Documentos Necesarios</h3>
                <div className="space-y-2">
                  {Array.from(requiredDocuments).map((doc) => {
                    const isUploaded = uploadedDocTypes.has(doc);
                    return (
                      <div
                        key={doc}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          isUploaded
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {isUploaded ? (
                            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className={`font-medium ${
                            isUploaded ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {doc}
                          </span>
                        </div>
                        <span className={`text-xs font-medium ${
                          isUploaded ? 'text-green-700' : 'text-red-700'
                        }`}>
                          {isUploaded ? 'Cargado' : 'Faltante'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {order.order_documents && order.order_documents.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Documentos Cargados</h3>
                  <div className="space-y-2">
                    {order.order_documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <div>
                            <p className="font-medium text-gray-900">{doc.document_type}</p>
                            <p className="text-xs text-gray-600">{doc.file_name}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => window.open(doc.file_url, '_blank')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Ver
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stock' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-amber-900">Verificación de Disponibilidad</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Confirme que hay stock suficiente para todas las armas solicitadas
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Armas y Stock Disponible</h3>
                <div className="space-y-3">
                  {order.order_items?.map((item) => {
                    const hasStock = (item.weapon?.stock || 0) >= item.quantity;
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-lg border ${
                          hasStock
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {hasStock ? (
                                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                              )}
                              <h4 className={`font-medium ${
                                hasStock ? 'text-green-900' : 'text-red-900'
                              }`}>
                                {item.weapon?.name}
                              </h4>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              {item.weapon?.caliber} - {item.weapon?.manufacturer}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Solicitado:</span>
                                <span className="font-medium text-gray-900 ml-1">{item.quantity}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Disponible:</span>
                                <span className={`font-medium ml-1 ${
                                  hasStock ? 'text-green-700' : 'text-red-700'
                                }`}>
                                  {item.weapon?.stock || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {!isValidated && (
          <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas de Validación (Opcional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Agregar comentarios sobre la validación..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                onClick={() => handleValidation('rejected')}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Rechazar'}
              </button>
              <button
                onClick={() => handleValidation('approved')}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Aprobar'}
              </button>
            </div>
          </div>
        )}

        {isValidated && (
          <div className="border-t border-gray-200 px-6 py-4 bg-green-50">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-medium text-green-900">
                  {user.role === 'administrator' ? 'Documentos ya validados' : 'Stock ya verificado'}
                </p>
                <p className="text-sm text-green-700">Esta orden ya ha sido procesada</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
