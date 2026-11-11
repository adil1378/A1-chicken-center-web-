"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles, Layers, ArrowUpRight, ShieldCheck, Flame, Scale } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CutDetail {
  id: string;
  name: string;
  anatomyTag: string;
  imageSrc: string;
  proteinRatio: string;
  moistureIndex: string;
  bestCookingStyle: string;
  butcherNote: string;
  vector: { x: number; y: number; rotate: number };
}

const CUTS: CutDetail[] = [
  {
    id: "breast-fillet",
    name: "Boneless Breast Fillet",
    anatomyTag: "Pectoralis Major & Minor",
    imageSrc: "/assets/images/boneless-breast.jpg",
    proteinRatio: "27g per 100g",
    moistureIndex: "98% Natural Juices",
    bestCookingStyle: "Tandoori Tikka, Grills, Diet Meal Prep",
    butcherNote: "Trimmed clean of tendon and intercostal fat. Never injected with water.",
    vector: { x: -60, y: -40, rotate: -3 },
  },
  {
    id: "drumstick-leg",
    name: "Whole Leg & Drumstick",
    anatomyTag: "Femur & Tibia Quarter",
    imageSrc: "/assets/images/whole-carving.jpg",
    proteinRatio: "22g per 100g",
    moistureIndex: "Rich Dark Meat Marrow",
    bestCookingStyle: "Dum Biryani, Slow Cooked Gravies, Tandoori",
    butcherNote: "Severed precisely at the hip ball socket. Intact bone marrow for maximum gravy flavor.",
    vector: { x: -60, y: 40, rotate: 2 },
  },
  {
    id: "curry-cubes",
    name: "Precision Diced Curry Cut",
    anatomyTag: "Cross-Section Primal Cuts",
    imageSrc: "/assets/images/diced-cubes.jpg",
    proteinRatio: "Balanced Muscle Tissue",
    moistureIndex: "Even Heat Absorption",
    bestCookingStyle: "Home Curries, Handi Chicken, Korma",
    butcherNote: "Uniform 25mm to 30mm cuts ensuring each piece cooks at the exact same rate.",
    vector: { x: 60, y: 40, rotate: -2 },
  },
  {
    id: "whole-bird",
    name: "Whole Dressed Carcass",
    anatomyTag: "100% Cleaned Poultry",
    imageSrc: "/assets/images/whole-carving.jpg",
    proteinRatio: "Complete Bird Profile",
    moistureIndex: "Skin-on Natural Barrier",
    bestCookingStyle: "Whole Oven Roast, Spit Roast, Family Feast",
    butcherNote: "Completely eviscerated and flame-cleansed of micro-feathers.",
    vector: { x: 60, y: -40, rotate: 3 },
  },
];

export default function ScrollCutsSeparation() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinViewportRef = useRef<HTMLDivElement | null>(null);
  const cutsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centerHubRef = useRef<HTMLDivElement | null>(null);

  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [selectedCut, setSelectedCut] = useState<CutDetail>(CUTS[0]);

  // Check viewport and reduced motion
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // GSAP ScrollTrigger Integration for Desktop
  useEffect(() => {
    if (isMobile) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const pinViewport = pinViewportRef.current;
    const centerHub = centerHubRef.current;

    if (!container || !pinViewport || !centerHub) return;

    const ctx = gsap.context(() => {
      // Master timeline pinned across 1800px of scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=1600",
          scrub: 1,
          pin: pinViewport,
          anticipatePin: 1,
        },
      });

      // Stage 1: Central whole bird begins to glow and scale slightly
      tl.to(centerHub, {
        scale: 0.88,
        opacity: 0.4,
        duration: 0.3,
        ease: "power2.out",
      });

      // Stage 2: 4 Cuts separate outward smoothly
      cutsRefs.current.forEach((cutCard, index) => {
        if (!cutCard) return;
        const target = CUTS[index].vector;

        tl.to(
          cutCard,
          {
            xPercent: target.x,
            yPercent: target.y,
            rotation: target.rotate,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
          },
          0.2
        );
      });

      // Stage 3: Highlights on completion
      tl.to(
        pinViewport,
        {
          backgroundColor: "#08080A",
          duration: 0.4,
        },
        0.7
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, [isMobile]);

  return (
    <section ref={containerRef} className="relative bg-black-deep text-white border-t border-black-border">
      {/* Viewport that gets pinned by ScrollTrigger on desktop */}
      <div
        ref={pinViewportRef}
        className="min-h-screen w-full flex flex-col justify-between py-12 px-6 lg:px-12 relative overflow-hidden"
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto z-10 pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800 text-brand-500 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Scroll-Driven Anatomy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
            Anatomy of Freshness: The Cut Separation
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-black-muted">
            {isMobile
              ? "Tap each anatomical cut to inspect its butchery profile, tenderness, and optimal cooking method."
              : "Scroll down to witness the dressed chicken separate into its precision butchered cuts."}
          </p>
        </div>

        {/* DESKTOP: Interactive Exploded Cut Viewport */}
        {!isMobile ? (
          <div className="relative flex-1 w-full max-w-6xl mx-auto flex items-center justify-center my-6 min-h-[560px]">
            {/* Center Anchor: The Whole Dressed Bird Hub */}
            <div
              ref={centerHubRef}
              className="absolute z-0 w-64 h-64 sm:w-80 sm:h-80 rounded-full border border-brand-800/40 bg-gradient-to-br from-brand-950/40 via-black-surface to-black-deep flex flex-col items-center justify-center text-center p-6 shadow-2xl backdrop-blur-sm pointer-events-none transition-all"
            >
              <div className="w-12 h-12 rounded-full bg-brand-600/20 border border-brand-500/40 flex items-center justify-center mb-3">
                <Sparkles className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-sm font-bold tracking-wider uppercase text-white">Primal Whole Bird</h3>
              <p className="text-xs text-brand-500 font-mono mt-1">100% Farm Fresh</p>
              <span className="text-[11px] text-black-muted mt-2">Continuous Scroll Controls Separation</span>
            </div>

            {/* 4 Floating Anatomical Cut Cards */}
            <div className="relative w-full h-full min-h-[520px] flex items-center justify-center">
              {CUTS.map((cut, index) => (
                <div
                  key={cut.id}
                  ref={(el) => {
                    cutsRefs.current[index] = el;
                  }}
                  className="absolute z-10 w-72 sm:w-80 rounded-2xl bg-black-surface/95 border border-black-border hover:border-brand-600/80 p-4 shadow-2xl transition-shadow backdrop-blur-md"
                  style={{
                    // Initial collapsed state before scroll
                    opacity: 0.85,
                    transform: "scale(0.95)",
                  }}
                >
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-3 border border-black-border bg-black-deep">
                    <Image
                      src={cut.imageSrc}
                      alt={cut.name}
                      fill
                      sizes="320px"
                      className="object-cover object-center"
                    />
                    <div className="absolute top-2 left-2 bg-black-deep/85 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-brand-500 uppercase border border-brand-900">
                      {cut.anatomyTag}
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <h4 className="text-base font-bold text-white flex items-center justify-between">
                      <span>{cut.name}</span>
                      <ArrowUpRight className="w-4 h-4 text-brand-500" />
                    </h4>

                    <p className="text-xs text-black-muted leading-relaxed line-clamp-2">
                      {cut.butcherNote}
                    </p>

                    <div className="pt-2 border-t border-black-border flex items-center justify-between text-[11px]">
                      <span className="text-white-off/90 font-medium flex items-center gap-1">
                        <Scale className="w-3 h-3 text-brand-500" />
                        {cut.proteinRatio}
                      </span>
                      <span className="text-brand-500 font-mono font-medium flex items-center gap-1">
                        <Flame className="w-3 h-3" />
                        {cut.bestCookingStyle.split(",")[0]}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* MOBILE FALLBACK: Interactive Card Selector */
          <div className="my-8 max-w-xl mx-auto w-full">
            {/* Cut Pills */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {CUTS.map((cut) => {
                const isActive = cut.id === selectedCut.id;
                return (
                  <button
                    key={cut.id}
                    onClick={() => setSelectedCut(cut)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                      isActive
                        ? "bg-brand-600 border-brand-500 text-white shadow-md shadow-brand-950"
                        : "bg-black-surface border-black-border text-white-off hover:border-brand-800"
                    }`}
                  >
                    {cut.name}
                  </button>
                );
              })}
            </div>

            {/* Mobile Active Cut Card */}
            <div className="bg-black-surface border border-brand-800/60 rounded-2xl p-5 shadow-2xl">
              <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-4 border border-black-border bg-black-deep">
                <Image
                  src={selectedCut.imageSrc}
                  alt={selectedCut.name}
                  fill
                  sizes="100vw"
                  className="object-cover object-center"
                  priority
                />
                <div className="absolute top-2 left-2 bg-black-deep/85 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-brand-500 uppercase border border-brand-900">
                  {selectedCut.anatomyTag}
                </div>
              </div>

              <h4 className="text-xl font-bold text-white mb-1">{selectedCut.name}</h4>
              <p className="text-xs text-brand-500 font-medium mb-3">{selectedCut.anatomyTag}</p>
              <p className="text-xs sm:text-sm text-black-muted mb-4 leading-relaxed">
                {selectedCut.butcherNote}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-black-border text-xs">
                <div className="p-2 rounded-lg bg-black-deep border border-black-border">
                  <span className="text-[10px] text-black-muted block uppercase">Protein Ratio</span>
                  <span className="text-white-off font-semibold">{selectedCut.proteinRatio}</span>
                </div>
                <div className="p-2 rounded-lg bg-black-deep border border-black-border">
                  <span className="text-[10px] text-black-muted block uppercase">Best For</span>
                  <span className="text-brand-500 font-semibold">{selectedCut.bestCookingStyle}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Guarantee Banner */}
        <div className="max-w-4xl mx-auto w-full pt-4 border-t border-black-border text-center flex flex-wrap items-center justify-between text-xs text-black-muted gap-2 z-10">
          <span className="flex items-center gap-1.5 text-white-off/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Separated Along Natural Joints &bull; Zero Shattered Bones
          </span>
          <span className="font-mono text-brand-500">A1 Butchery Assurance</span>
        </div>
      </div>
    </section>
  );
}
