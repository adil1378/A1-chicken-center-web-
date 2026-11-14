import React from "react";
import CinematicHero from "@/components/cinematic/CinematicHero";
import ButcherCuttingSequence from "@/components/cinematic/ButcherCuttingSequence";
import ScrollCutsSeparation from "@/components/cinematic/ScrollCutsSeparation";
import HygieneShowcase from "@/components/cinematic/HygieneShowcase";
import ProductCatalog from "@/components/catalog/ProductCatalog";
import { CartProvider } from "@/context/CartContext";

export default function Home() {
  return (
    <CartProvider>
      <main className="min-h-screen bg-black-deep text-white-pure selection:bg-brand-600 selection:text-white">
        {/* 1. Cinematic Opening Scene & Video Hero */}
        <CinematicHero />

        {/* 2. Realistic Butcher-Style Cutting Sequence */}
        <ButcherCuttingSequence />

        {/* 3. Scroll-Driven Chicken Part Separation (GSAP + ScrollTrigger) */}
        <ScrollCutsSeparation />

        {/* 4. Cut Varieties & Home-Cooking Showcase */}
        <HygieneShowcase />

        {/* 5. Phase 3: Category-Wise Product Catalog & Shopping UI */}
        <ProductCatalog />

        {/* Cinematic Experience Footer */}
        <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-black-border text-center sm:flex sm:items-center sm:justify-between text-xs text-black-muted">
          <div className="flex items-center justify-center sm:justify-start gap-3 mb-4 sm:mb-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-600 to-brand-900 flex items-center justify-center font-bold text-sm tracking-wider text-white">
              A1
            </div>
            <div className="text-left">
              <p className="font-bold text-white text-sm">A1 CHICKEN CENTER</p>
              <p className="text-[11px] text-brand-500 font-medium">Freshness You Can Trust.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs">
            <span>&copy; 2026 A1 Chicken Center. All rights reserved.</span>
            <span className="hidden sm:inline text-black-border">&bull;</span>
            <span className="text-white-off/80 font-medium">Phase 3: Product Catalog &amp; Shopping UI</span>
          </div>
        </footer>
      </main>
    </CartProvider>
  );
}
