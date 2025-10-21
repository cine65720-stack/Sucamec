import { X, Trash2, Plus, Minus } from 'lucide-react';
import { Weapon } from '../lib/supabase';

export interface CartItem {
  weapon: Weapon;
  quantity: number;
}

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (weaponId: string, quantity: number) => void;
  onRemoveItem: (weaponId: string) => void;
  onCheckout: () => void;
}

export default function ShoppingCart({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: ShoppingCartProps) {
  if (!isOpen) return null;

  const total = items.reduce((sum, item) => sum + item.weapon.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center md:justify-end">
      <div className="bg-white w-full md:w-[480px] h-[80vh] md:h-full md:max-h-screen flex flex-col rounded-t-2xl md:rounded-none shadow-2xl">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Carrito de Compras</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-2">Tu carrito está vacío</p>
              <p className="text-gray-400">Agrega armamento desde el catálogo</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.weapon.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <img
                        src={item.weapon.image_url}
                        alt={item.weapon.name}
                        className="w-24 h-24 object-cover rounded"
                      />

                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900 mb-1">{item.weapon.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {item.weapon.caliber} - {item.weapon.manufacturer}
                        </p>
                        <p className="text-lg font-bold text-slate-900">
                          S/ {item.weapon.price.toFixed(2)}
                        </p>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.weapon.id)}
                        className="text-red-500 hover:text-red-700 h-8 w-8 flex items-center justify-center"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onUpdateQuantity(item.weapon.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded flex items-center justify-center"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.weapon.id, item.quantity + 1)}
                          disabled={item.quantity >= item.weapon.stock}
                          className="w-8 h-8 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded flex items-center justify-center"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-lg font-bold text-slate-900">
                        S/ {(item.weapon.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 p-6 bg-gray-50">
              <div className="mb-4">
                <div className="flex justify-between text-gray-600 mb-2">
                  <span>Subtotal:</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-xl text-slate-900">
                  <span>Total:</span>
                  <span>S/ {total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-lg transition-colors"
              >
                Proceder con el Pedido
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                Al proceder, deberás completar tus datos para registrar el pedido
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
