import { X, AlertCircle, CheckCircle, Upload, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { CartItem } from './ShoppingCart';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderComplete: () => void;
}

export default function CheckoutModal({ isOpen, onClose, items, onOrderComplete }: CheckoutModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    dni: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [requiredDocs, setRequiredDocs] = useState<string[]>([]);
  const [documents, setDocuments] = useState<{ [key: string]: File | null }>({});

  useEffect(() => {
    if (isOpen && items.length > 0) {
      fetchRequiredDocuments();
    }
  }, [isOpen, items]);

  const fetchRequiredDocuments = async () => {
    try {
      const weaponIds = items.map(item => item.weapon.id);
      const { data: weapons } = await supabase
        .from('weapons')
        .select('required_documents')
        .in('id', weaponIds);

      if (weapons) {
        const allDocs = new Set<string>();
        weapons.forEach((weapon: any) => {
          if (weapon.required_documents && Array.isArray(weapon.required_documents)) {
            weapon.required_documents.forEach((doc: string) => allDocs.add(doc));
          }
        });
        const uniqueDocs = Array.from(allDocs);
        setRequiredDocs(uniqueDocs);

        const initialDocs: { [key: string]: File | null } = {};
        uniqueDocs.forEach(doc => {
          initialDocs[doc] = null;
        });
        setDocuments(initialDocs);
      }
    } catch (err) {
      console.error('Error fetching required documents:', err);
    }
  };

  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.weapon.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.phone.length !== 9) {
      setError('El teléfono debe tener exactamente 9 dígitos');
      setLoading(false);
      return;
    }

    if (!formData.email.includes('@')) {
      setError('El email debe contener @');
      setLoading(false);
      return;
    }

    const missingDocs = requiredDocs.filter(doc => !documents[doc]);
    if (missingDocs.length > 0) {
      setError(`Faltan documentos requeridos: ${missingDocs.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      let customerId: string;

      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('dni', formData.dni)
        .maybeSingle();

      if (existingCustomer) {
        customerId = existingCustomer.id;

        await supabase
          .from('customers')
          .update({
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          })
          .eq('id', customerId);
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            full_name: formData.fullName,
            dni: formData.dni,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
          })
          .select()
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      const generatedOrderNumber = `SUCAMEC-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          order_number: generatedOrderNumber,
          status: 'pendiente',
          total_amount: total,
          notes: formData.notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = items.map(item => ({
        order_id: order.id,
        weapon_id: item.weapon.id,
        quantity: item.quantity,
        unit_price: item.weapon.price,
        subtotal: item.weapon.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      for (const docType of requiredDocs) {
        const file = documents[docType];
        if (file) {
          await supabase
            .from('order_documents')
            .insert({
              order_id: order.id,
              document_type: docType,
              file_url: `placeholder_${file.name}`,
              file_name: file.name,
            });
        }
      }

      setOrderNumber(generatedOrderNumber);
      setSuccess(true);

      setTimeout(() => {
        onOrderComplete();
        onClose();
        setSuccess(false);
        setFormData({
          fullName: '',
          dni: '',
          email: '',
          phone: '',
          address: '',
          notes: '',
        });
        setDocuments({});
        setRequiredDocs([]);
      }, 3000);

    } catch (err: any) {
      setError(err.message || 'Error al procesar el pedido');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 9) {
        setFormData(prev => ({
          ...prev,
          [name]: numericValue,
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (docType: string, file: File | null) => {
    setDocuments(prev => ({
      ...prev,
      [docType]: file,
    }));
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Pedido Registrado Exitosamente</h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 mb-2">Número de Orden:</p>
            <p className="text-xl font-bold text-green-800">{orderNumber}</p>
          </div>
          <p className="text-gray-600 mb-2">
            Tu pedido ha sido registrado correctamente.
          </p>
          <p className="text-sm text-gray-500">
            Puedes consultar el estado de tu pedido usando tu DNI o número de orden en la sección "Mis Pedidos".
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-2xl w-full my-8">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-2xl font-bold">Completar Pedido</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Datos del Solicitante</h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DNI *
                </label>
                <input
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{8}"
                  maxLength={8}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  pattern=".*@.*"
                  title="El email debe contener @"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono * (9 dígitos)
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{9}"
                  maxLength={9}
                  title="Debe ingresar exactamente 9 dígitos"
                  placeholder="987654321"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                placeholder="Información adicional sobre el pedido..."
              />
            </div>
          </div>

          {requiredDocs.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documentos Requeridos
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-blue-900">
                  Basado en las armas seleccionadas, necesitas proporcionar los siguientes documentos:
                </p>
              </div>

              <div className="space-y-4">
                {requiredDocs.map((docType) => (
                  <div key={docType} className="border border-gray-300 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {docType} *
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 cursor-pointer hover:border-amber-500 hover:bg-amber-50 transition-colors">
                        <Upload className="w-5 h-5 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {documents[docType] ? documents[docType]!.name : 'Seleccionar archivo'}
                        </span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                          onChange={(e) => handleFileChange(docType, e.target.files?.[0] || null)}
                          required
                        />
                      </label>
                      {documents[docType] && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Formatos aceptados: PDF, JPG, PNG
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="font-bold text-lg text-slate-900 mb-4">Resumen del Pedido</h3>

            <div className="space-y-2 mb-4">
              {items.map(item => (
                <div key={item.weapon.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.weapon.name} x {item.quantity}
                  </span>
                  <span className="font-medium text-slate-900">
                    S/ {(item.weapon.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between text-xl font-bold text-slate-900">
                <span>Total:</span>
                <span>S/ {total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-amber-900">
              Al enviar este pedido, un representante de SUCAMEC se pondrá en contacto contigo
              para coordinar la presentación de la documentación requerida y proceder con la autorización.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg transition-colors"
          >
            {loading ? 'Procesando...' : 'Registrar Pedido'}
          </button>
        </form>
      </div>
    </div>
  );
}
