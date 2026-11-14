"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, SlidersHorizontal, Info } from "lucide-react";
import { Product } from "@/types/catalog";
import ProductPlaceholderImage from "./ProductPlaceholderImage";

interface ProductCardProps {
  product: Product;
  onOpenDetails: (product: Product) => void;
}

export default function ProductCard({ product, onOpenDetails }: ProductCardProps) {
  const hasCustomizations =
    product.customizations.supportsPieceSize ||
    product.customizations.supportsSkinOption ||
    product.customizations.supportsKeema ||
    product.customizations.supportsCleaningStyle;

  return (
    <div className="bg-black-surface border border-black-border hover:border-brand-800/60 rounded-2xl overflow-hidden shadow-xl transition duration-300 flex flex-col justify-between group">
      {/* Product Visual */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black-deep">
        {product.imageSrc ? (
          <Image
            src={product.imageSrc}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center filter contrast-[1.05] brightness-95 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <ProductPlaceholderImage categoryId={product.categoryId} productName={product.name} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black-surface via-transparent to-transparent pointer-events-none" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 bg-black-deep/90 border border-brand-900/60 px-2.5 py-1 rounded-lg backdrop-blur-md">
          <span className="text-[10px] font-mono text-brand-500 font-bold uppercase tracking-wider">
            {product.categoryName}
          </span>
        </div>

        {/* Availability Badge */}
        <div className="absolute top-3 right-3 bg-black-deep/90 border border-black-border px-2.5 py-1 rounded-lg backdrop-blur-md">
          <span className="text-[10px] font-mono text-white-off/70 font-medium">
            {product.availability === "available"
              ? "In Stock"
              : "To be confirmed by shop"}
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-brand-500 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-black-muted leading-relaxed line-clamp-2">
            {product.description}
          </p>

          <div className="pt-2 border-t border-black-border flex items-center gap-1.5 text-[11px] text-white-off/80 font-medium">
            <span className="text-brand-500 font-semibold shrink-0">Best for:</span>
            <span className="truncate">{product.culinaryUse}</span>
          </div>
        </div>

        {/* Customization Capabilities Pill */}
        {hasCustomizations && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {product.customizations.supportsPieceSize && (
              <span className="px-2 py-0.5 rounded bg-black-deep border border-black-border text-[10px] text-white-off/70 font-mono">
                Piece Sizing
              </span>
            )}
            {product.customizations.supportsSkinOption && (
              <span className="px-2 py-0.5 rounded bg-black-deep border border-black-border text-[10px] text-white-off/70 font-mono">
                Skin On/Off
              </span>
            )}
            {product.customizations.supportsKeema && (
              <span className="px-2 py-0.5 rounded bg-black-deep border border-black-border text-[10px] text-white-off/70 font-mono">
                Keema Option
              </span>
            )}
            {product.customizations.supportsCleaningStyle && (
              <span className="px-2 py-0.5 rounded bg-black-deep border border-black-border text-[10px] text-white-off/70 font-mono">
                Custom Dressing
              </span>
            )}
          </div>
        )}

        {/* Pricing & Order CTA */}
        <div className="pt-3 border-t border-black-border flex items-center justify-between gap-3">
          {/* Honest Pricing Display */}
          <div>
            {product.pricePerUnit !== null ? (
              <div>
                <span className="text-base font-extrabold text-white">
                  ₹{product.pricePerUnit}
                </span>
                <span className="text-[11px] text-black-muted ml-1">/{product.unitType}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[11px] text-brand-500 font-medium">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>Price to be confirmed</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={() => onOpenDetails(product)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold transition shadow-md shadow-brand-950/40 shrink-0"
            aria-label={`Configure portion and cut options for ${product.name}`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Configure Portion</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

