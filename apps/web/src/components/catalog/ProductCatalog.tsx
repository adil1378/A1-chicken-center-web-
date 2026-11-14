"use client";

import React, { useState } from "react";
import { ShoppingBag, Sparkles, Filter } from "lucide-react";
import { CategoryId, Product } from "@/types/catalog";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";
import CategoryNavigation from "./CategoryNavigation";
import ProductCard from "./ProductCard";
import ProductDetailsDialog from "./ProductDetailsDialog";
import CartDrawer from "./CartDrawer";

export default function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const { openCart, totalItemsCount } = useCart();

  // Filter products by category
  const filteredProducts =
    selectedCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter((product) => product.categoryId === selectedCategory);

  const activeCategoryInfo = CATEGORIES.find((cat) => cat.id === selectedCategory);

  return (
    <section
      id="catalog"
      className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black-base border-t border-black-border"
      aria-labelledby="catalog-heading"
    >
      {/* Background glow accent */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/60 border border-brand-800/40 text-brand-500 text-xs font-mono tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Product Catalog &amp; Custom Cuts</span>
          </div>

          <h2
            id="catalog-heading"
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase"
          >
            Poultry Selection &amp; Cut Options
          </h2>

          <p className="text-sm sm:text-base text-black-muted leading-relaxed">
            Browse our selection of chicken cuts, boneless portions, wings, desi chicken, and farm eggs. Select your portion size and butcher cut preferences for your recipes. This catalog is a local portion selection tool; pricing and availability will be confirmed directly by the shop.
          </p>
        </div>

        {/* Category Navigation Pills */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-mono text-black-muted">
              <Filter className="w-3.5 h-3.5 text-brand-500" />
              <span>Filter by Category:</span>
            </div>
            <span className="text-xs font-mono text-brand-500">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
            </span>
          </div>

          <CategoryNavigation
            categories={CATEGORIES}
            activeCategoryId={selectedCategory}
            onSelectCategory={(catId) => setSelectedCategory(catId)}
          />
        </div>

        {/* Active Category Banner */}
        {activeCategoryInfo && (
          <div className="bg-black-surface/60 border border-black-border/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 backdrop-blur-sm">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                {activeCategoryInfo.name}
              </h3>
              <p className="text-xs text-black-muted mt-0.5">
                {activeCategoryInfo.tagline}
              </p>
            </div>
            <div className="text-[11px] font-mono text-white-off/60 shrink-0">
              Available with tailored portioning &amp; cut options
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="region"
          aria-label="Products display"
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetails={(p) => setActiveProduct(p)}
            />
          ))}
        </div>

        {/* Catalog Footer Info */}
        <div className="p-6 rounded-2xl bg-black-surface border border-black-border text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs text-white-off/80 font-medium">
            Portion Selection &amp; Customization Tool
          </p>
          <p className="text-[11px] text-black-muted leading-relaxed">
            Portion preferences, mince requests, and custom cut styles can be configured in this selection tool. Pricing and availability will be confirmed directly by the shop upon review.
          </p>
        </div>
      </div>

      {/* Floating Cart Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={openCart}
          className="relative flex items-center gap-3 px-5 py-3.5 rounded-full bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider shadow-2xl shadow-brand-950/80 transition-all hover:scale-105 active:scale-95 border border-brand-400/30"
          aria-label={`Open shopping cart with ${totalItemsCount} items`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-white text-brand-700 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span>View Cart</span>
          {totalItemsCount > 0 && (
            <span className="bg-brand-800/80 px-2 py-0.5 rounded-full text-[10px] font-mono">
              {totalItemsCount}
            </span>
          )}
        </button>
      </div>

      {/* Product Details Modal Dialog */}
      <ProductDetailsDialog
        product={activeProduct}
        isOpen={activeProduct !== null}
        onClose={() => setActiveProduct(null)}
      />

      {/* Cart Drawer */}
      <CartDrawer />
    </section>
  );
}
