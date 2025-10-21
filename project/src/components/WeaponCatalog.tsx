import { useState, useEffect } from 'react';
import { supabase, Weapon, WeaponCategory } from '../lib/supabase';
import { Package, Info, ShoppingCart } from 'lucide-react';
import WeaponDetailsModal from './WeaponDetailsModal';

interface WeaponCatalogProps {
  onAddToCart: (weapon: Weapon, quantity: number) => void;
}

export default function WeaponCatalog({ onAddToCart }: WeaponCatalogProps) {
  const [categories, setCategories] = useState<WeaponCategory[]>([]);
  const [weapons, setWeapons] = useState<Weapon[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedWeapon, setSelectedWeapon] = useState<Weapon | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [categoriesRes, weaponsRes] = await Promise.all([
        supabase.from('weapon_categories').select('*').order('name'),
        supabase.from('weapons').select('*').order('name'),
      ]);

      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (weaponsRes.data) setWeapons(weaponsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWeapons = selectedCategory === 'all'
    ? weapons
    : weapons.filter(w => w.category_id === selectedCategory);

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || '';
  };

  if (loading) {
    return (
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">Cargando catálogo...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="catalog" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Catálogo de Armamento
          </h2>
          <p className="text-lg text-gray-600">
            Armamento regulado por SUCAMEC para uso autorizado
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todas las Categorías
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWeapons.map(weapon => (
            <div
              key={weapon.id}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={weapon.image_url}
                  alt={weapon.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
                    {getCategoryName(weapon.category_id)}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {weapon.name}
                </h3>

                <div className="space-y-1 mb-4 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Calibre:</span> {weapon.caliber}
                  </p>
                  <p>
                    <span className="font-medium">Fabricante:</span> {weapon.manufacturer}
                  </p>
                  <p>
                    <span className="font-medium">Stock:</span>{' '}
                    <span className={weapon.stock > 10 ? 'text-green-600' : 'text-amber-600'}>
                      {weapon.stock} unidades
                    </span>
                  </p>
                </div>

                <div className="mb-4">
                  <p className="text-2xl font-bold text-slate-900">
                    S/ {weapon.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedWeapon(weapon)}
                    className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <Info className="w-4 h-4" />
                    Detalles
                  </button>
                  <button
                    onClick={() => onAddToCart(weapon, 1)}
                    disabled={weapon.stock === 0}
                    className="flex-1 flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredWeapons.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No hay armas disponibles en esta categoría</p>
          </div>
        )}
      </div>

      {selectedWeapon && (
        <WeaponDetailsModal
          weapon={selectedWeapon}
          categoryName={getCategoryName(selectedWeapon.category_id)}
          onClose={() => setSelectedWeapon(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
}
