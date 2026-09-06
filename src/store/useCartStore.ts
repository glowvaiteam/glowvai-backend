import { useState, useEffect } from 'react';

export interface CartItemData {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  qty: number;
  image?: any;
  size?: string;
  customization?: string;
}

// In-memory reactive global cart state
let globalCart: Record<string, number> = {
  'prod-01': 1, // Default initial item for instant experience
};
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach(listener => listener());
}

export const cartActions = {
  getCart: () => ({ ...globalCart }),

  addToCart: (productId: string, qty: number = 1) => {
    const current = globalCart[productId] || 0;
    globalCart = { ...globalCart, [productId]: current + qty };
    notifyListeners();
  },

  updateQty: (productId: string, delta: number) => {
    const current = globalCart[productId] || 0;
    const next = current + delta;
    if (next <= 0) {
      const nextCart = { ...globalCart };
      delete nextCart[productId];
      globalCart = nextCart;
    } else {
      globalCart = { ...globalCart, [productId]: next };
    }
    notifyListeners();
  },

  removeFromCart: (productId: string) => {
    const nextCart = { ...globalCart };
    delete nextCart[productId];
    globalCart = nextCart;
    notifyListeners();
  },

  clearCart: () => {
    globalCart = {};
    notifyListeners();
  },

  getTotalCount: () => {
    return Object.values(globalCart).reduce((sum, count) => sum + count, 0);
  },

  getTotalPrice: (priceMap: Record<string, number>) => {
    return Object.entries(globalCart).reduce((sum, [id, count]) => {
      const unitPrice = priceMap[id] || 499;
      return sum + unitPrice * count;
    }, 0);
  },
};

/**
 * Reactive React Hook for Global Cart State
 */
export function useCartStore() {
  const [cart, setCart] = useState<Record<string, number>>(cartActions.getCart());

  useEffect(() => {
    const handleChange = () => {
      setCart(cartActions.getCart());
    };
    listeners.add(handleChange);
    return () => {
      listeners.delete(handleChange);
    };
  }, []);

  const totalCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  return {
    cart,
    items: cart,
    totalCount,
    addToCart: cartActions.addToCart,
    updateQty: cartActions.updateQty,
    incrementQuantity: (productId: string) => cartActions.updateQty(productId, 1),
    decrementQuantity: (productId: string) => cartActions.updateQty(productId, -1),
    removeFromCart: cartActions.removeFromCart,
    clearCart: cartActions.clearCart,
    getTotalPrice: cartActions.getTotalPrice,
  };
}

export default useCartStore;
