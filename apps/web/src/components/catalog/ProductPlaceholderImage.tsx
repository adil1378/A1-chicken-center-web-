import React from "react";
import { Egg, Feather, Flame, Layers, Utensils, Slice } from "lucide-react";
import { CategoryId } from "@/types/catalog";

interface ProductPlaceholderProps {
  categoryId: CategoryId;
  productName: string;
}

export default function ProductPlaceholderImage({ categoryId, productName }: ProductPlaceholderProps) {
  const getIcon = () => {
    switch (categoryId) {
      case "eggs":
        return <Egg className="w-12 h-12 text-brand-500 stroke-[1.5]" />;
      case "lollipop-wings":
        return <Feather className="w-12 h-12 text-brand-500 stroke-[1.5]" />;
      case "country-chicken":
        return <Flame className="w-12 h-12 text-brand-500 stroke-[1.5]" />;
      case "whole-chicken":
        return <Layers className="w-12 h-12 text-brand-500 stroke-[1.5]" />;
      default:
        return <Slice className="w-12 h-12 text-brand-500 stroke-[1.5]" />;
    }
  };

  return (
    <div
      className="w-full h-full min-h-[180px] bg-gradient-to-br from-black-surface via-black-deep to-brand-950/30 flex flex-col items-center justify-center p-6 text-center border border-brand-900/40 relative overflow-hidden group select-none"
      role="img"
      aria-label={`${productName} custom butchery cut representation`}
    >
      {/* Background subtle geometric lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#EF4444_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

      {/* Center Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-black-surface border border-brand-800/60 shadow-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
        {getIcon()}
      </div>

      {/* Label */}
      <span className="text-xs font-mono font-bold text-brand-500 uppercase tracking-widest block mb-0.5">
        Custom Butcher Cut
      </span>
      <span className="text-[11px] text-white-off/70 font-medium">
        Portioned for your recipe
      </span>
    </div>
  );
}

