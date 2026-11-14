"use client";

import React from "react";
import { Grid, Utensils, Sparkles, Flame, Feather, Layers, Egg } from "lucide-react";
import { Category, CategoryId } from "@/types/catalog";

interface CategoryNavigationProps {
  categories: Category[];
  activeCategoryId: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
}

export default function CategoryNavigation({
  categories,
  activeCategoryId,
  onSelectCategory,
}: CategoryNavigationProps) {
  const getCategoryIcon = (iconName: Category["iconName"]) => {
    switch (iconName) {
      case "Grid":
        return <Grid className="w-4 h-4 shrink-0" />;
      case "Utensils":
        return <Utensils className="w-4 h-4 shrink-0" />;
      case "Sparkles":
        return <Sparkles className="w-4 h-4 shrink-0" />;
      case "Flame":
        return <Flame className="w-4 h-4 shrink-0" />;
      case "Feather":
        return <Feather className="w-4 h-4 shrink-0" />;
      case "Layers":
        return <Layers className="w-4 h-4 shrink-0" />;
      case "Egg":
        return <Egg className="w-4 h-4 shrink-0" />;
      default:
        return <Utensils className="w-4 h-4 shrink-0" />;
    }
  };

  return (
    <nav className="w-full relative" aria-label="Product categories navigation">
      {/* Scrollable container on mobile, wrapped flex on desktop */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center"
        role="group"
        aria-label="Filter products by category"
      >
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;
          return (
            <button
              type="button"
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition whitespace-nowrap border shrink-0 ${
                isActive
                  ? "bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-950/50"
                  : "bg-black-surface border-black-border text-white-off/80 hover:border-brand-900/60 hover:text-white hover:bg-black-deep"
              }`}
              aria-pressed={isActive}
              aria-label={`Filter by ${category.name}`}
            >
              <span className={isActive ? "text-white" : "text-brand-500"}>
                {getCategoryIcon(category.iconName)}
              </span>
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

