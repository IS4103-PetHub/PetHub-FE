import { createContext, useContext } from "react";
import useLocalStorage from "@/hooks/use-local-storage";
import { Cart, CartItem } from "@/types/types";

type CartContextType = {
  carts: Cart[];
  setCarts: (carts: Cart[]) => void;
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
  const defaultCart: Cart[] = [];
  const [carts, setCarts] = useLocalStorage<Cart[]>("carts", defaultCart);

  return (
    <CartContext.Provider value={{ carts, setCarts }}>
      {children}
    </CartContext.Provider>
  );
};
