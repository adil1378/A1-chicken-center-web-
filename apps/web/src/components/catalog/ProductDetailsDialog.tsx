"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  X,
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle2,
  Info,
  Check,
} from "lucide-react";
import {
  Product,
  PieceSizeOption,
  SkinOption,
  KeemaOption,
  CleaningOption,
  SelectedCustomizations,
} from "@/types/catalog";
import { useCart } from "@/context/CartContext";
import { lockBodyScroll, unlockBodyScroll } from "@/utils/scrollLock";
import ProductPlaceholderImage from "./ProductPlaceholderImage";
import WeightSelector from "./WeightSelector";

interface ProductDetailsDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductDetailsDialog({
  product,
  isOpen,
  onClose,
}: ProductDetailsDialogProps) {
  const { addItem } = useCart();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastActiveElementRef = useRef<HTMLElement | null>(null);

  // Customization state
  const [selectedWeight, setSelectedWeight] = useState<number>(1.0);
  const [isWeightValid, setIsWeightValid] = useState<boolean>(true);
  const [selectedPieceSize, setSelectedPieceSize] = useState<PieceSizeOption>("Medium (Standard)");
  const [selectedSkin, setSelectedSkin] = useState<SkinOption>("Skin Off");
  const [selectedKeema, setSelectedKeema] = useState<KeemaOption>("Regular Cut (Not Minced)");
  const [selectedCleaning, setSelectedCleaning] = useState<CleaningOption>("Standard Dressing");
  const [customerNote, setCustomerNote] = useState<string>("");
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  // Initialize options whenever product opens or changes
  useEffect(() => {
    if (product) {
      setSelectedWeight(product.defaultWeight);
      setIsWeightValid(true);
      setSelectedPieceSize(
        product.customizations.pieceSizes?.[0] || "Medium (Standard)"
      );
      setSelectedSkin(
        product.customizations.skinOptions?.[0] || "Skin Off"
      );
      setSelectedKeema(
        product.customizations.keemaOptions?.[0] || "Regular Cut (Not Minced)"
      );
      setSelectedCleaning(
        product.customizations.cleaningOptions?.[0] || "Standard Dressing"
      );
      setCustomerNote("");
      setItemQuantity(1);
      setAddedNotice(false);
    }
  }, [product, isOpen]);

  // Handle ESC key, focus trapping, and shared scroll lock
  useEffect(() => {
    if (!isOpen) return;

    // Capture currently focused element to restore when closing
    lastActiveElementRef.current = (document.activeElement as HTMLElement) || null;

    // Lock body scroll using shared reference-counted lock
    lockBodyScroll();

    // Focus close button initially
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
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
  }, [isOpen, onClose]);

  if (!isOpen || !product) {
    return null;
  }

  const { customizations } = product;

  const handleAddToCart = () => {
    if (!isWeightValid) {
      return;
    }

    const selectedCustomizations: SelectedCustomizations = {};

    if (customizations.supportsPieceSize) {
      selectedCustomizations.pieceSize = selectedPieceSize;
    }
    if (customizations.supportsSkinOption) {
      selectedCustomizations.skinOption = selectedSkin;
    }
    if (customizations.supportsKeema) {
      selectedCustomizations.keemaOption = selectedKeema;
    }
    if (customizations.supportsCleaningStyle) {
      selectedCustomizations.cleaningOption = selectedCleaning;
    }
    if (customizations.customNotesAllowed && customerNote.trim()) {
      selectedCustomizations.customerNote = customerNote.trim();
    }

    addItem({
      productId: product.id,
      productName: product.name,
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      imageSrc: product.imageSrc,
      weightAmount: selectedWeight,
      unitType: product.unitType,
      quantity: itemQuantity,
      customizations: selectedCustomizations,
      pricePerUnit: product.pricePerUnit,
    });

    setAddedNotice(true);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-dialog-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Content */}
      <div
        ref={dialogRef}
        className="relative w-full max-w-2xl bg-black-surface border border-brand-900/40 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header with image & close button */}
        <div className="relative h-44 sm:h-56 w-full bg-black-deep shrink-0">
          {product.imageSrc ? (
            <Image
              src={product.imageSrc}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 672px"
              className="object-cover object-center filter contrast-[1.05]"
            />
          ) : (
            <ProductPlaceholderImage categoryId={product.categoryId} productName={product.name} />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black-surface via-black-surface/40 to-transparent pointer-events-none" />

          {/* Close Button */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-black-deep/80 hover:bg-black-deep text-white hover:text-brand-500 border border-black-border transition shadow-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category Tag */}
          <div className="absolute top-4 left-4 bg-black-deep/90 border border-brand-900/60 px-3 py-1 rounded-lg backdrop-blur-md">
            <span className="text-[11px] font-mono text-brand-500 font-bold uppercase tracking-wider">
              {product.categoryName}
            </span>
          </div>

          {/* Product Title over image bottom */}
          <div className="absolute bottom-3 left-5 right-5">
            <h2
              id="product-dialog-title"
              className="text-xl sm:text-2xl font-extrabold text-white tracking-tight"
            >
              {product.name}
            </h2>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-white-off">
          {/* Description & Culinary Use */}
          <div className="space-y-2">
            <p className="text-sm text-black-muted leading-relaxed">
              {product.description}
            </p>
            <div className="flex items-center gap-2 text-xs text-white-off/90 bg-black-deep/60 p-2.5 rounded-xl border border-black-border">
              <span className="text-brand-500 font-bold shrink-0">Culinary Recommendation:</span>
              <span>{product.culinaryUse}</span>
            </div>
          </div>

          {/* Honest Pricing Notice */}
          <div className="bg-black-deep border border-black-border p-3.5 rounded-2xl flex items-start gap-3">
            <Info className="w-5 h-5 text-brand-500 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className="font-semibold text-white">
                {product.pricePerUnit !== null
                  ? `Confirmed Price: ₹${product.pricePerUnit} / ${product.unitType}`
                  : "Price to be Confirmed"}
              </p>
              <p className="text-black-muted leading-relaxed">
                {product.pricePerUnit !== null
                  ? "Standard catalog price confirmed."
                  : "Pricing and product availability will be confirmed directly by the shop."}
              </p>
            </div>
          </div>

          {/* Availability Status Notice */}
          <div className="flex items-center gap-2 text-xs text-white-off/80 bg-black-deep/60 p-2.5 rounded-xl border border-black-border">
            <span className="text-brand-500 font-bold shrink-0">Availability:</span>
            <span>
              {product.availability === "available"
                ? "In Stock (Confirmed)"
                : "Subject to shop confirmation"}
            </span>
          </div>

          {/* Weight & Portion Selection */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-brand-500">
              Select Portion / Weight
            </h3>
            <WeightSelector
              unitType={product.unitType}
              selectedWeight={selectedWeight}
              onWeightChange={(val) => setSelectedWeight(val)}
              onValidityChange={(valid) => setIsWeightValid(valid)}
            />
          </div>

          {/* Customization Options: Piece Size */}
          {customizations.supportsPieceSize && customizations.pieceSizes && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-brand-500">
                  Piece Size
                </h3>
                <span className="text-[11px] text-black-muted">Select preferred cut size</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="group" aria-label="Piece Size Options">
                {customizations.pieceSizes.map((size) => {
                  const isSelected = selectedPieceSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedPieceSize(size)}
                      aria-pressed={isSelected}
                      className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? "bg-brand-950/40 border-brand-500 text-white shadow-sm shadow-brand-900/30"
                          : "bg-black-deep border-black-border text-white-off/80 hover:border-black-muted"
                      }`}
                    >
                      <span className="text-xs font-semibold">{size}</span>
                      {isSelected && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customization Options: Skin On / Skin Off */}
          {customizations.supportsSkinOption && customizations.skinOptions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-brand-500">
                  Skin Preference
                </h3>
                <span className="text-[11px] text-black-muted">With or without skin</span>
              </div>
              <div className="grid grid-cols-2 gap-2" role="group" aria-label="Skin Preference Options">
                {customizations.skinOptions.map((skin) => {
                  const isSelected = selectedSkin === skin;
                  return (
                    <button
                      key={skin}
                      type="button"
                      onClick={() => setSelectedSkin(skin)}
                      aria-pressed={isSelected}
                      className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? "bg-brand-950/40 border-brand-500 text-white shadow-sm shadow-brand-900/30"
                          : "bg-black-deep border-black-border text-white-off/80 hover:border-black-muted"
                      }`}
                    >
                      <span className="text-xs font-semibold">{skin}</span>
                      {isSelected && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customization Options: Keema Mince */}
          {customizations.supportsKeema && customizations.keemaOptions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-brand-500">
                  Mince / Keema Cut
                </h3>
                <span className="text-[11px] text-black-muted">Optional mincing preparation</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2" role="group" aria-label="Mince Options">
                {customizations.keemaOptions.map((opt) => {
                  const isSelected = selectedKeema === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedKeema(opt)}
                      aria-pressed={isSelected}
                      className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? "bg-brand-950/40 border-brand-500 text-white shadow-sm shadow-brand-900/30"
                          : "bg-black-deep border-black-border text-white-off/80 hover:border-black-muted"
                      }`}
                    >
                      <span className="text-xs font-semibold">{opt}</span>
                      {isSelected && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Customization Options: Whole Chicken Dressing */}
          {customizations.supportsCleaningStyle && customizations.cleaningOptions && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-brand-500">
                  Whole Bird Dressing Style
                </h3>
                <span className="text-[11px] text-black-muted">Custom dressed to your recipe</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" role="group" aria-label="Dressing Style Options">
                {customizations.cleaningOptions.map((opt) => {
                  const isSelected = selectedCleaning === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setSelectedCleaning(opt)}
                      aria-pressed={isSelected}
                      className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? "bg-brand-950/40 border-brand-500 text-white shadow-sm shadow-brand-900/30"
                          : "bg-black-deep border-black-border text-white-off/80 hover:border-black-muted"
                      }`}
                    >
                      <span className="text-xs font-semibold">{opt}</span>
                      {isSelected && <Check className="w-4 h-4 text-brand-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Notes */}
          {customizations.customNotesAllowed && (
            <div className="space-y-2">
              <label htmlFor="customer-notes-input" className="text-xs font-mono font-bold tracking-wider uppercase text-brand-500 block">
                Butcher Cutting Notes (Optional)
              </label>
              <textarea
                id="customer-notes-input"
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                rows={2}
                maxLength={200}
                placeholder="e.g. Trim excess fat, separate liver & gizzard, fine slices for gravy"
                className="w-full bg-black-deep border border-black-border rounded-xl px-3 py-2 text-xs text-white placeholder-black-muted focus:outline-none focus:border-brand-500 transition resize-none"
              />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-black-deep border-t border-black-border flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          {/* Quantity Controls */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-xs text-black-muted font-medium">Quantity:</span>
            <div className="flex items-center bg-black-surface border border-black-border rounded-xl p-1">
              <button
                type="button"
                onClick={() => setItemQuantity((q) => Math.max(1, q - 1))}
                disabled={itemQuantity <= 1}
                className="p-1.5 rounded-lg text-white-off hover:text-white hover:bg-black-border/50 disabled:opacity-30 disabled:hover:bg-transparent transition"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-8 text-center text-xs font-bold text-white">
                {itemQuantity}
              </span>
              <button
                type="button"
                onClick={() => setItemQuantity((q) => Math.min(20, q + 1))}
                disabled={itemQuantity >= 20}
                className="p-1.5 rounded-lg text-white-off hover:text-white hover:bg-black-border/50 disabled:opacity-30 disabled:hover:bg-transparent transition"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart CTA */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={!isWeightValid || addedNotice}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition shadow-lg ${
              addedNotice
                ? "bg-green-600 text-white"
                : !isWeightValid
                ? "bg-black-border text-white-off/40 cursor-not-allowed border border-brand-900/40"
                : "bg-brand-600 hover:bg-brand-500 text-white shadow-brand-950/50"
            }`}
          >
            {addedNotice ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>Add {itemQuantity} to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

