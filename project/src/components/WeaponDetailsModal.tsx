import { X, ShoppingCart, FileText, Package } from 'lucide-react';
import { useState } from 'react';
import { Weapon } from '../lib/supabase';

interface WeaponDetailsModalProps {
  weapon: Weapon;
  categoryName: string;
  onClose: () => void;
  onAddToCart: (weapon: Weapon, quantity: number) => void;
}

export default function WeaponDetailsModal({
  weapon,
  categoryName,
  onClose,
  onAddToCart,
}: WeaponDetailsModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(weapon, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Detalles del Armamento</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <img
                src={weapon.image_url}
                alt={weapon.name}
                className="w-full rounded-lg shadow-md"
              />
            </div>

            <div>
              <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-sm font-semibold rounded-full mb-3">
                {categoryName}
              </span>

              <h3 className="text-3xl font-bold text-slate-900 mb-4">{weapon.name}</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Calibre:</span>
                  <span className="text-gray-900">{weapon.caliber}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Fabricante:</span>
                  <span className="text-gray-900">{weapon.manufacturer}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="font-medium text-gray-700">Stock Disponible:</span>
                  <span className={`font-semibold ${weapon.stock > 10 ? 'text-green-600' : 'text-amber-600'}`}>
                    {weapon.stock} unidades
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-gray-700 leading-relaxed">{weapon.description}</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <p className="text-3xl font-bold text-amber-900">
                  S/ {weapon.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <label className="font-medium text-gray-700">Cantidad:</label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={weapon.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Math.min(weapon.stock, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center border border-gray-300 rounded px-2 py-1"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(weapon.stock, quantity + 1))}
                    className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded flex items-center justify-center font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={weapon.stock === 0}
                className="w-full flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Agregar al Carrito
              </button>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Especificaciones Técnicas
            </h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {weapon.specifications.peso && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Peso</p>
                  <p className="text-lg font-semibold text-slate-900">{weapon.specifications.peso}</p>
                </div>
              )}
              {weapon.specifications.capacidad && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Capacidad</p>
                  <p className="text-lg font-semibold text-slate-900">{weapon.specifications.capacidad}</p>
                </div>
              )}
              {weapon.specifications.longitud && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-1">Longitud</p>
                  <p className="text-lg font-semibold text-slate-900">{weapon.specifications.longitud}</p>
                </div>
              )}
            </div>

            <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Documentación Requerida
            </h4>
            <ul className="space-y-2">
              {weapon.required_documents.map((doc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  <span className="text-gray-700">{doc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
