import { useEffect, useState } from "react";
import { Cart, CartItem } from "@/types/types";
import useLocalStorage from "./use-local-storage";

export function useCartOperations(userId: number) {
  const [carts, setCarts] = useLocalStorage<Cart[]>("carts", []);
  const [cart, setCart] = useState<Cart>(
    carts.find((c) => c.userId === userId) || {
      userId,
      itemCount: 0,
      cartItems: [],
    },
  );

  useEffect(() => {
    const userCart = carts.find((c) => c.userId === userId) || {
      userId,
      itemCount: 0,
      cartItems: [],
    };
    setCart(userCart);
  }, [carts, userId]);

  /* ============================================== Helper Functions ============================================== */

  // Happens every add, update or remove to ensure cartItemId is always in order and starting from 1
  const recalculateCartItemId = (cartItems: CartItem[]) => {
    return cartItems.map((item, index) => ({ ...item, cartItemId: index + 1 }));
  };

  // Set the cart for the specific user only (since 1 browser can have multiple users)
  const setCartForUser = async (updatedCart: Cart) => {
    const updatedCarts = carts
      .filter((c) => c.userId !== userId)
      .concat(updatedCart);
    setCarts(updatedCarts);
    setCart(updatedCart);
  };

  const calculateTotalItemCount = (cartItems: CartItem[]) => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  };

  /* ============================================== Helper Functions ============================================== */

  const addItemToCart = async (item: CartItem, incrementBy: number = 1) => {
    if (!item.serviceListing.calendarGroupId) {
      const existingItem = cart.cartItems.find(
        (cartItem) =>
          cartItem.serviceListing.serviceListingId ===
          item.serviceListing.serviceListingId,
      );

      // Item doesn't have a CG and already exists in cart, increment its quantity
      if (existingItem) {
        return incrementItemQuantity(existingItem.cartItemId, incrementBy);
      }
    }

    // Item has a CG and hence is singular, add it to cart regardless
    const newCartItems = [...cart.cartItems, item];
    const recalculatedCartItems = recalculateCartItemId(newCartItems);
    setCartForUser({
      ...cart,
      itemCount: calculateTotalItemCount(recalculatedCartItems),
      cartItems: recalculatedCartItems,
    });
  };

  const incrementItemQuantity = async (
    cartItemId: number,
    incrementBy: number = 1,
  ) => {
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.cartItemId === cartItemId,
    );
    if (itemIndex !== -1 && cart.cartItems[itemIndex]?.quantity) {
      const newCartItems = [...cart.cartItems];
      newCartItems[itemIndex].quantity += incrementBy;
      const recalculatedCartItems = recalculateCartItemId(newCartItems);
      setCartForUser({
        ...cart,
        itemCount: calculateTotalItemCount(recalculatedCartItems),
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
      itemCount: calculateTotalItemCount(recalculatedCartItems),
      cartItems: recalculatedCartItems,
    });
  };

  const setItemQuantity = (cartItemId: number, newQuantity: number) => {
    const itemIndex = cart.cartItems.findIndex(
      (item) => item.cartItemId === cartItemId,
    );

    if (itemIndex !== -1) {
      const newCartItems = [...cart.cartItems];
      if (newQuantity <= 0) {
        newCartItems.splice(itemIndex, 1); // remove item for cart if set to 0
      } else {
        newCartItems[itemIndex].quantity = newQuantity;
      }
      const recalculatedCartItems = recalculateCartItemId(newCartItems);
      setCartForUser({
        ...cart,
        itemCount: calculateTotalItemCount(recalculatedCartItems),
        cartItems: recalculatedCartItems,
      });
    }
  };

  const clearCart = () => {
    setCartForUser({
      ...cart,
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

  const getItemCount = () => {
    return cart.itemCount;
  };

  const getCartSubtotal = () => {
    return cart.cartItems.reduce(
      (acc, item) => acc + (item.quantity || 1) * item.serviceListing.basePrice,
      0,
    );
  };

  return {
    cart,
    addItemToCart,
    incrementItemQuantity,
    setItemQuantity,
    removeItemFromCart,
    getCartItems,
    getCartItem,
    clearCart,
    getItemCount,
    getCartSubtotal,
  };
}
