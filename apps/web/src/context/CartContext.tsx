"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem } from "@/types/catalog";

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  totalItemsCount: number;
  subtotal: number | null;
  isPricingConfirmed: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function generateCartItemId(item: Omit<CartItem, "id">): string {
  const parts = [
    item.productId,
    item.weightAmount,
    item.unitType,
    item.customizations.pieceSize || "none",
    item.customizations.skinOption || "none",
    item.customizations.keemaOption || "none",
    item.customizations.cleaningOption || "none",
    item.customizations.customerNote || "",
  ];
  return parts.join("::");
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  // Optional: load / persist cart to local storage in browser
  useEffect(() => {
    try {
      const saved = localStorage.getItem("a1_cart_items");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // Local storage not available or disabled
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("a1_cart_items", JSON.stringify(items));
    } catch {
      // Local storage not available
    }
  }, [items]);

  const addItem = (newItemData: Omit<CartItem, "id">) => {
    const id = generateCartItemId(newItemData);
    setItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + newItemData.quantity,
        };
        return updated;
      }
      return [...prev, { ...newItemData, id }];
    });
    setIsCartOpen(true);
  };

  const removeItem = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const totalItemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // PRICING INTEGRITY CALCULATION:
  // If items list is empty, subtotal is 0.
  // If any item has pricePerUnit === null, then pricing is NOT confirmed,
  // and subtotal MUST BE null (never treat null as 0, never fabricate partial totals).
  const isPricingConfirmed = items.length > 0 && items.every((i) => i.pricePerUnit !== null);

  const subtotal: number | null = items.length === 0
    ? 0
    : isPricingConfirmed
    ? items.reduce((sum, i) => sum + (i.pricePerUnit as number) * i.weightAmount * i.quantity, 0)
    : null;

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        totalItemsCount,
        subtotal,
        isPricingConfirmed,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

