import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // بارگذاری اولیه از localStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // ذخیره توی localStorage هر وقت cartItems تغییر کنه
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    } else {
      localStorage.removeItem("cartItems");
    }
  }, [cartItems]);

  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      const quantity = Math.max(1, parseInt(item.quantity) || 1); // مقدار پیش‌فرض ۱ اگه نامعتبر باشه
      const price = parseFloat(item.price) || 0; // تبدیل به عدد

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, price, quantity } : i // جایگزینی با مقدار جدید
        );
      }
      return [...prevItems, { ...item, price, quantity }]; // اضافه کردن آیتم جدید
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const cartCount = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);