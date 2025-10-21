import { Shield, FileText, Phone, ShoppingCart, Package } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  cartItemsCount: number;
  onCartClick: () => void;
  onOrdersClick: () => void;
}

export default function Navbar({ cartItemsCount, onCartClick, onOrdersClick }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('');

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Shield className="w-8 h-8 text-amber-500" />
            <span className="text-xl font-bold">SUCAMEC</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollToSection('requisitos')}
              className={`flex items-center gap-2 hover:text-amber-500 transition-colors ${activeSection === 'requisitos' ? 'text-amber-500' : ''}`}
            >
              <FileText className="w-5 h-5" />
              <span className="font-medium">Requisitos</span>
            </button>

            <button
              onClick={() => scrollToSection('catalog')}
              className={`flex items-center gap-2 hover:text-amber-500 transition-colors ${activeSection === 'catalog' ? 'text-amber-500' : ''}`}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Catálogo</span>
            </button>

            <button
              onClick={() => scrollToSection('contacto')}
              className={`flex items-center gap-2 hover:text-amber-500 transition-colors ${activeSection === 'contacto' ? 'text-amber-500' : ''}`}
            >
              <Phone className="w-5 h-5" />
              <span className="font-medium">Contacto</span>
            </button>

            <button
              onClick={onOrdersClick}
              className="flex items-center gap-2 hover:text-amber-500 transition-colors"
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Mis Pedidos</span>
            </button>

            <button
              onClick={onCartClick}
              className="relative flex items-center gap-2 bg-amber-600 hover:bg-amber-700 px-4 py-2 rounded-lg transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Carrito</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
