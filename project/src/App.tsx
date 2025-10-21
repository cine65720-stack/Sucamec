import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Requirements from './components/Requirements';
import WeaponCatalog from './components/WeaponCatalog';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ShoppingCart, { CartItem } from './components/ShoppingCart';
import CheckoutModal from './components/CheckoutModal';
import OrderTracking from './components/OrderTracking';
import { Weapon } from './lib/supabase';

function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderTrackingOpen, setIsOrderTrackingOpen] = useState(false);

  const handleAddToCart = (weapon: Weapon, quantity: number) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.weapon.id === weapon.id);

      if (existingItem) {
        return prevItems.map(item =>
          item.weapon.id === weapon.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, weapon.stock) }
            : item
        );
      }

      return [...prevItems, { weapon, quantity }];
    });
  };

  const handleUpdateQuantity = (weaponId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(weaponId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.weapon.id === weaponId
          ? { ...item, quantity: Math.min(quantity, item.weapon.stock) }
          : item
      )
    );
  };

  const handleRemoveItem = (weaponId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.weapon.id !== weaponId));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onOrdersClick={() => setIsOrderTrackingOpen(true)}
      />

      <Hero />
      <Requirements />
      <WeaponCatalog onAddToCart={handleAddToCart} />
      <Contact />
      <Footer />

      <ShoppingCart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderComplete={handleOrderComplete}
      />

      <OrderTracking
        isOpen={isOrderTrackingOpen}
        onClose={() => setIsOrderTrackingOpen(false)}
      />
    </div>
  );
}

export default App;
