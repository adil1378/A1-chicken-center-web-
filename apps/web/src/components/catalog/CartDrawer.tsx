"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Info,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { lockBodyScroll, unlockBodyScroll } from "@/utils/scrollLock";
import ProductPlaceholderImage from "./ProductPlaceholderImage";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    isCartOpen,
    closeCart,
    totalItemsCount,
    subtotal,
    isPricingConfirmed,
  } = useCart();

  const drawerRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  // Handle ESC, focus trap, focus restoration, and shared body-scroll lock
  useEffect(() => {
    if (!isCartOpen) return;

    // Capture currently focused element to restore when closing
    lastActiveElementRef.current = (document.activeElement as HTMLElement) || null;

    // Lock body scroll using shared lock
    lockBodyScroll();

    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeCart();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      unlockBodyScroll();
      window.removeEventListener("keydown", handleKeyDown);
      lastActiveElementRef.current?.focus();
    };
  }, [isCartOpen, closeCart]);

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-black-surface border-l border-brand-900/40 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300"
        >
          {/* Header */}
          <div className="p-5 border-b border-black-border flex items-center justify-between bg-black-deep">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-brand-950/60 border border-brand-800/40 text-brand-500">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white tracking-wide">
                  Portion Selection Cart
                </h2>
                <p className="text-xs text-black-muted font-mono">
                  {totalItemsCount} {totalItemsCount === 1 ? "item" : "items"} selected • Local selection tool
                </p>
              </div>
            </div>

            <button
              ref={closeBtnRef}
              type="button"
              onClick={closeCart}
              className="p-2 rounded-full hover:bg-black-border text-white-off hover:text-white transition focus:outline-none focus:ring-2 focus:ring-brand-500"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4 text-black-muted">
                <div className="p-4 rounded-full bg-black-deep border border-black-border text-brand-500/60">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-white">Your cart is empty</p>
                  <p className="text-xs max-w-xs text-black-muted">
                    Explore our cuts, portioning options, and whole chicken selections.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeCart}
                  className="mt-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <ul className="space-y-3" aria-label="Cart items list">
                {items.map((item) => {
                  const hasCustomizations =
                    item.customizations.pieceSize ||
                    item.customizations.skinOption ||
                    item.customizations.keemaOption ||
                    item.customizations.cleaningOption ||
                    item.customizations.customerNote;

                  return (
                    <li
                      key={item.id}
                      className="p-4 rounded-2xl bg-black-deep border border-black-border hover:border-black-muted/60 transition space-y-3"
                    >
                      {/* Top: Image, Name, and Remove */}
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black-surface shrink-0 border border-black-border">
                          {item.imageSrc ? (
                            <Image
                              src={item.imageSrc}
                              alt={item.productName}
                              fill
                              sizes="64px"
                              className="object-cover object-center"
                            />
                          ) : (
                            <ProductPlaceholderImage
                              categoryId={item.categoryId}
                              productName={item.productName}
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                              {item.productName}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeItem(item.id)}
                              className="text-black-muted hover:text-brand-500 transition p-1"
                              aria-label={`Remove ${item.productName} from cart`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <p className="text-[11px] text-brand-500 font-mono mt-0.5">
                            Portion: {item.weightAmount} {item.unitType}
                          </p>
                        </div>
                      </div>

                      {/* Customization Details */}
                      {hasCustomizations && (
                        <div className="text-[10px] text-white-off/70 bg-black-surface/80 p-2.5 rounded-lg border border-black-border space-y-0.5">
                          {item.customizations.pieceSize && (
                            <p>
                              <span className="text-brand-500 font-semibold">Cut:</span>{" "}
                              {item.customizations.pieceSize}
                            </p>
                          )}
                          {item.customizations.skinOption && (
                            <p>
                              <span className="text-brand-500 font-semibold">Skin:</span>{" "}
                              {item.customizations.skinOption}
                            </p>
                          )}
                          {item.customizations.keemaOption && (
                            <p>
                              <span className="text-brand-500 font-semibold">Mince:</span>{" "}
                              {item.customizations.keemaOption}
                            </p>
                          )}
                          {item.customizations.cleaningOption && (
                            <p>
                              <span className="text-brand-500 font-semibold">Style:</span>{" "}
                              {item.customizations.cleaningOption}
                            </p>
                          )}
                          {item.customizations.customerNote && (
                            <p className="italic text-white-off/60">
                              Note: {item.customizations.customerNote}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Bottom: Quantity Controls & Price */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center bg-black-surface border border-black-border rounded-xl p-0.5">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded text-white-off hover:text-white transition"
                            aria-label={`Decrease quantity of ${item.productName}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-white">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded text-white-off hover:text-white transition"
                            aria-label={`Increase quantity of ${item.productName}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price display with strict integrity */}
                        <div className="text-right">
                          {item.pricePerUnit !== null ? (
                            <span className="text-xs font-bold text-white">
                              ₹{(item.pricePerUnit * item.weightAmount * item.quantity).toFixed(0)}
                            </span>
                          ) : (
                            <span className="text-[10px] text-brand-500 font-medium">
                              Price to be confirmed
                            </span>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Footer with Subtotal & Actions */}
          {items.length > 0 && (
            <div className="p-5 border-t border-black-border bg-black-deep space-y-4">
              {/* Subtotal Calculation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-black-muted font-medium">Estimated Items:</span>
                  <span className="text-white font-mono">{totalItemsCount}</span>
                </div>

                <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-black-border">
                  <span className="text-white">Subtotal:</span>
                  {isPricingConfirmed && subtotal !== null ? (
                    <span className="text-base text-brand-500 font-extrabold">
                      ₹{subtotal.toFixed(0)}
                    </span>
                  ) : (
                    <div className="text-right">
                      <span className="text-xs text-brand-500 font-semibold block">
                        To be confirmed by shop
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Informational Notice */}
              <div className="p-3 rounded-xl bg-black-surface border border-black-border flex items-start gap-2 text-[11px] text-black-muted">
                <Info className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                <p>
                  Pricing and availability will be confirmed directly by the shop. This cart is a local portion selection tool and does not submit an online order.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={clearCart}
                  className="w-full py-2 rounded-xl border border-black-border hover:border-brand-900 text-black-muted hover:text-white text-xs font-medium transition"
                >
                  Clear Cart
                </button>

                <button
                  type="button"
                  onClick={closeCart}
                  className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg shadow-brand-950/50"
                >
                  <span>Continue Browsing Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

