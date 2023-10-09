import { createContext, useContext, useState } from "react";
import { CartItem } from "@/types/types";

type CartContextType = {
  cartItemCount: number;
  setCartItemCount: (count: number) => void;
  cartItems: CartItem[];
  setCartItems: (cartItems: CartItem[]) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  //   const setItemCount = (count: number) => setCartItemCount(count);
  //   const setItems = (cartItems: CartItem[]) => setCartItems(cartItems);

  console.log("cart ITEMS in CONTEXT:", cartItems);

  return (
    <CartContext.Provider
      value={{ cartItemCount, setCartItemCount, cartItems, setCartItems }}
    >
      {children}
    </CartContext.Provider>
  );
};
