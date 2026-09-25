import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {

  const [cart, setCart] = useState([]);

  // Store URL of the current customer's store
  const [storeUrl, setStoreUrl] = useState(null);


  // ===============================
  // SET CURRENT STORE
  // ===============================

  const setCurrentStore = (url) => {

    if (url) {
      setStoreUrl(url);
    }

  };


  // ===============================
  // ADD PRODUCT TO CART
  // ===============================

  const addToCart = (product, currentStoreUrl = null) => {

    setCart((previousCart) => {

      // If cart already has products,
      // check which store they belong to
      if (previousCart.length > 0) {

        const currentStoreId =
          previousCart[0].store_id;

        const newProductStoreId =
          product.store_id;

        // Prevent products from different stores
        if (
          Number(currentStoreId) !==
          Number(newProductStoreId)
        ) {

          alert(
            "You can only add products from one store at a time."
          );

          return previousCart;
        }

      }


      // Save the store URL
      if (currentStoreUrl) {
        setStoreUrl(currentStoreUrl);
      }


      // Check if product already exists
      const existingProduct =
        previousCart.find(
          (item) => item.id === product.id
        );


      // Increase quantity if product exists
      if (existingProduct) {

        return previousCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1
              }
            : item
        );

      }


      // Add new product
      return [
        ...previousCart,
        {
          ...product,
          quantity: 1
        }
      ];

    });

  };


  // ===============================
  // INCREASE QUANTITY
  // ===============================

  const increaseQuantity = (productId) => {

    setCart((previousCart) =>
      previousCart.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity: item.quantity + 1
            }
          : item
      )
    );

  };


  // ===============================
  // DECREASE QUANTITY
  // ===============================

  const decreaseQuantity = (productId) => {

    setCart((previousCart) =>
      previousCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );

  };


  // ===============================
  // REMOVE PRODUCT
  // ===============================

  const removeFromCart = (productId) => {

    setCart((previousCart) =>
      previousCart.filter(
        (item) => item.id !== productId
      )
    );

  };


  // ===============================
  // CLEAR CART
  // ===============================

  const clearCart = () => {

    setCart([]);

    // Keep storeUrl so the customer
    // can continue shopping at the same store

  };


  // ===============================
  // CART COUNT
  // ===============================

  const cartCount = cart.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  return (

    <CartContext.Provider
      value={{
        cart,
        storeUrl,
        setCurrentStore,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        cartCount
      }}
    >

      {children}

    </CartContext.Provider>

  );

}


export function useCart() {

  return useContext(CartContext);

}