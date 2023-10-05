import { Cart, CartItem } from "@/types/types";
import useLocalStorage from "./use-local-storage";

export function useCartOperations(userId: number) {
  const [carts, setCarts] = useLocalStorage<Cart[]>("carts", []);

  const cart = carts.find((c) => c.userId === userId) || {
    userId,
    subtotal: 0,
    itemCount: 0,
    cartItems: [],
  };

  // Set the cart for the specific user only (since 1 browser can have multiple users)
  const setCartForUser = async (updatedCart: Cart) => {
    const updatedCarts = carts
      .filter((c) => c.userId !== userId)
      .concat(updatedCart);
    setCarts(updatedCarts);
  };

  // Happens every add, update or remove
  const recalculateSubtotal = (cartItems: CartItem[]) => {
    return cartItems.reduce(
      (acc, item) => acc + (item.serviceListing.basePrice || 0),
      0,
    );
  };

  // Happens every add, update or remove to ensure cartItemId is always in order and starting from 1
  const recalculateCartItemId = (cartItems: CartItem[]) => {
    return cartItems.map((item, index) => ({ ...item, cartItemId: index + 1 }));
  };

  const addItemToCart = async (item: CartItem) => {
    const newCartItems = [...cart.cartItems, item];
    const recalculatedCartItems = recalculateCartItemId(newCartItems);
    setCartForUser({
      ...cart,
      itemCount: recalculatedCartItems.length,
      subtotal: recalculateSubtotal(recalculatedCartItems),
      cartItems: recalculatedCartItems,
    });
  };

  const updateItemInCart = async (
    cartItemId: number,
    updatedItem: CartItem,
  ) => {
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.cartItemId === cartItemId,
    );
    if (itemIndex !== -1) {
      const newCartItems = [...cart.cartItems];
      newCartItems[itemIndex] = updatedItem;
      const recalculatedCartItems = recalculateCartItemId(newCartItems);
      setCartForUser({
        ...cart,
        subtotal: recalculateSubtotal(recalculatedCartItems),
        cartItems: recalculatedCartItems,
      });
    }
  };

  const removeItemFromCart = async (cartItemId: number) => {
    const newCartItems = cart.cartItems.filter(
      (item) => item.cartItemId !== cartItemId,
    );
    const recalculatedCartItems = recalculateCartItemId(newCartItems);
    setCartForUser({
      ...cart,
      itemCount: recalculatedCartItems.length,
      subtotal: recalculateSubtotal(recalculatedCartItems),
      cartItems: recalculatedCartItems,
    });
  };

  const clearCart = () => {
    setCartForUser({
      ...cart,
      subtotal: 0,
      itemCount: 0,
      cartItems: [],
    });
  };

  const getCartItems = () => {
    return cart.cartItems;
  };

  const getCartItem = (cartItemId: number) => {
    return cart.cartItems[cartItemId - 1];
  };

  const getCartSubtotal = () => {
    return cart.subtotal;
  };

  const getItemCount = () => {
    return cart.itemCount;
  };

  return {
    cart,
    addItemToCart,
    updateItemInCart,
    removeItemFromCart,
    getCartItems,
    getCartItem,
    clearCart,
    getCartSubtotal,
    getItemCount,
  };
}
