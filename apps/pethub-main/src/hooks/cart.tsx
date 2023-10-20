import { useEffect } from "react";
import api from "@/api/axiosConfig";
import { useCart } from "@/components/cart/CartContext";
import { Cart, CartItem } from "@/types/types";

export function useCartOperations(userId: number) {
  const { carts, setCarts } = useCart();

  useEffect(() => {
    // sync all SL details with backend when a component using cart mounts
    syncCartWithBackend();
  }, []);

  /* ============================================== Helper Functions ============================================== */

  const isItemExpired = (date) => {
    return new Date() > new Date(date);
  };

  const getCurrentCart = () => {
    let currentCart = carts.find((cart) => cart.userId === userId);
    if (!currentCart) {
      currentCart = {
        userId,
        itemCount: 0,
        cartItems: [],
      };
      setCarts([...carts, currentCart]);
    }
    return currentCart;
  };

  const setCurrentCart = (newCart: Cart) => {
    const otherCarts = carts.filter((cart) => cart.userId !== userId);
    setCarts([...otherCarts, newCart]);
  };

  const syncCartWithBackend = async () => {
    const currentCart = getCurrentCart();
    // Get all unique serviceListingIds from the cart
    const serviceListingIds = Array.from(
      new Set(
        currentCart.cartItems.map(
          (item) => item.serviceListing.serviceListingId,
        ),
      ),
    );

    try {
      // get SL details from backend for each unique ID, update cart with it
      const serviceListingPromises = serviceListingIds.map((id) =>
        api.get(`/service-listings/${id}`),
      );
      const serviceListingResponses = await Promise.all(serviceListingPromises);
      const updatedListings = serviceListingResponses.map(
        (response) => response.data,
      );

      const updatedCartItems = currentCart.cartItems
        .map((item) => {
          const updatedListing = updatedListings.find(
            (listing) =>
              listing.serviceListingId === item.serviceListing.serviceListingId,
          );
          return {
            ...item,
            serviceListing: updatedListing || item.serviceListing, // Use updated listing or fallback to the old one
          };
        })
        .filter((item) => !isItemExpired(item.serviceListing.lastPossibleDate)); // Filter out expired SLs;

      setCurrentCart({
        ...currentCart,
        itemCount: calculateTotalItemCount(updatedCartItems),
        cartItems: updatedCartItems,
      });
    } catch (error) {
      console.error("Error syncing cart with backend [hooks/cart.tsx]:", error);
    }
  };

  const recalculateCartItemId = (cartItems: CartItem[]) => {
    return cartItems.map((item, index) => ({ ...item, cartItemId: index + 1 }));
  };

  const calculateTotalItemCount = (cartItems: CartItem[]) => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  };

  /* ============================================== Helper Functions ============================================== */

  /* ============================================== Settters ============================================= */

  const addItemToCart = async (item: CartItem, incrementBy: number = 1) => {
    const currentCart = getCurrentCart();

    const existingItem = currentCart.cartItems.find(
      (cartItem) =>
        cartItem.serviceListing.serviceListingId ===
        item.serviceListing.serviceListingId,
    );

    if (existingItem) {
      // Item doesn't have a CG and already exists in cart, increment its quantity
      return incrementItemQuantity(existingItem.cartItemId, incrementBy);
    }

    // Item has a CG and hence is singular, add it to cart regardless
    const newCartItems = [...currentCart.cartItems, item];
    const recalculatedCartItems = recalculateCartItemId(newCartItems);
    setCurrentCart({
      ...currentCart,
      itemCount: calculateTotalItemCount(recalculatedCartItems),
      cartItems: recalculatedCartItems,
    });
  };

  const incrementItemQuantity = (
    cartItemId: number,
    incrementBy: number = 1,
  ) => {
    const currentCart = getCurrentCart();

    const itemIndex = currentCart.cartItems.findIndex(
      (item) => item.cartItemId === cartItemId,
    );
    if (itemIndex !== -1 && currentCart.cartItems[itemIndex]?.quantity) {
      const newCartItems = [...currentCart.cartItems];
      newCartItems[itemIndex].quantity += incrementBy;
      const recalculatedCartItems = recalculateCartItemId(newCartItems);
      setCurrentCart({
        ...currentCart,
        itemCount: calculateTotalItemCount(recalculatedCartItems),
        cartItems: recalculatedCartItems,
      });
    }
  };

  const removeItemFromCart = (cartItemId: number) => {
    const currentCart = getCurrentCart();
    const newCartItems = currentCart.cartItems.filter(
      (item) => item.cartItemId !== cartItemId,
    );
    const recalculatedCartItems = recalculateCartItemId(newCartItems);
    setCurrentCart({
      ...currentCart,
      itemCount: calculateTotalItemCount(recalculatedCartItems),
      cartItems: recalculatedCartItems,
    });
  };

  const removeSelectedCartItems = () => {
    const currentCart = getCurrentCart();
    const newCartItems = currentCart.cartItems.filter(
      (item) => !item.isSelected,
    );
    const recalculatedCartItems = recalculateCartItemId(newCartItems);
    setCurrentCart({
      ...currentCart,
      itemCount: calculateTotalItemCount(recalculatedCartItems),
      cartItems: recalculatedCartItems,
    });
  };

  const setItemQuantity = (cartItemId: number, newQuantity: number) => {
    const currentCart = getCurrentCart();
    const itemIndex = currentCart.cartItems.findIndex(
      (item) => item.cartItemId === cartItemId,
    );
    if (itemIndex !== -1) {
      const newCartItems = [...currentCart.cartItems];
      if (newQuantity <= 0) {
        newCartItems.splice(itemIndex, 1); // remove item for cart if set to 0
      } else {
        newCartItems[itemIndex].quantity = newQuantity;
      }
      const recalculatedCartItems = recalculateCartItemId(newCartItems);
      setCurrentCart({
        ...currentCart,
        itemCount: calculateTotalItemCount(recalculatedCartItems),
        cartItems: recalculatedCartItems,
      });
    }
  };

  const setCartItemIsSelected = (cartItemId: number, isSelected: boolean) => {
    const currentCart = getCurrentCart();
    const itemIndex = currentCart.cartItems.findIndex(
      (item) => item.cartItemId === cartItemId,
    ); // find index of item IN CASE its messed up somehow
    if (itemIndex !== -1) {
      const newCartItems = [...currentCart.cartItems];
      newCartItems[itemIndex].isSelected = isSelected;
      const recalculatedCartItems = recalculateCartItemId(newCartItems);
      setCurrentCart({
        ...currentCart,
        itemCount: calculateTotalItemCount(recalculatedCartItems),
        cartItems: recalculatedCartItems,
      });
    }
  };

  const setAllCartItemsIsSelected = (isSelected: boolean) => {
    const currentCart = getCurrentCart();
    const newCartItems = [...currentCart.cartItems];
    newCartItems.forEach((item) => (item.isSelected = isSelected));
    const recalculatedCartItems = recalculateCartItemId(newCartItems);
    setCurrentCart({
      ...currentCart,
      itemCount: calculateTotalItemCount(recalculatedCartItems),
      cartItems: recalculatedCartItems,
    });
  };

  const clearCart = () => {
    setCurrentCart({
      ...getCurrentCart(),
      itemCount: 0,
      cartItems: [],
    });
  };

  /* ============================================== Settters ============================================= */

  /* ============================================== Getters ============================================== */

  const getCartItems = () => {
    return getCurrentCart().cartItems;
  };

  const getCartItem = (cartItemId: number) => {
    return getCurrentCart().cartItems.find(
      (item) => item.cartItemId === cartItemId,
    );
  };

  const getItemCount = () => {
    return getCurrentCart().itemCount;
  };

  const getCartSubtotal = () => {
    return getCurrentCart().cartItems.reduce(
      (acc, item) => acc + (item.quantity || 1) * item.serviceListing.basePrice,
      0,
    );
  };

  const getSelectedCartItems = () => {
    return getCurrentCart().cartItems.filter((item) => item.isSelected);
  };

  /* ============================================== Getters ============================================== */

  return {
    getCurrentCart,
    addItemToCart,
    incrementItemQuantity,
    setItemQuantity,
    removeItemFromCart,
    removeSelectedCartItems,
    getCartItems,
    getCartItem,
    clearCart,
    getItemCount,
    getCartSubtotal,
    setCartItemIsSelected,
    setAllCartItemsIsSelected,
    getSelectedCartItems,
  };
}
