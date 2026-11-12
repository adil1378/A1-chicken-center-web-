"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Layers, ArrowUpRight, ShieldCheck, Flame, Scale } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface CutDetail {
  id: string;
  name: string;
  anatomyTag: string;
  imageSrc: string;
  meatType: string;
  cookingStyle: string;
  butcherNote: string;
  vector: { x: number; y: number; rotate: number };
}

const CUTS: CutDetail[] = [
  {
    id: "breast-fillet",
    name: "Boneless Breast Fillet",
    anatomyTag: "Breast Meat",
    imageSrc: "/assets/images/boneless-breast.jpg",
    meatType: "Lean Skinless White Meat",
    cookingStyle: "Tandoori Tikka, Grills, Stir-Fries",
    butcherNote: "Carved from the ribcage and trimmed cleanly of excess fat and skin.",
    vector: { x: -85, y: -48, rotate: -2 },
  },
  {
    id: "drumstick-leg",
    name: "Fresh Drumstick Cut",
    anatomyTag: "Lower Leg Quarter",
    imageSrc: "/assets/images/drumstick-cut.jpg",
    meatType: "Juicy Dark Meat on Bone",
    cookingStyle: "Dum Biryani, Slow Gravies, Roasts",
    butcherNote: "Separated at the knee socket joint to keep the bone intact.",
    vector: { x: -85, y: 48, rotate: 2 },
  },
  {
    id: "joint-cuts",
    name: "Bone-in Joint Cuts",
    anatomyTag: "Wing & Back Joints",
    imageSrc: "/assets/images/whole-carving.jpg",
    meatType: "Skin-on Mixed Cuts",
    cookingStyle: "Slow-Braised Curries, Broths",
    butcherNote: "Portioned along natural joints for traditional bone-in gravies.",
    vector: { x: 85, y: -48, rotate: 2 },
  },
  {
    id: "curry-cubes",
    name: "Uniform Curry Pieces",
    anatomyTag: "Diced Primal Meat",
    imageSrc: "/assets/images/diced-cubes.jpg",
    meatType: "Bite-Sized Tender Cubes",
    cookingStyle: "Home Curries, Handi, Korma",
    butcherNote: "Cut to consistent portion sizes so all pieces cook evenly.",
    vector: { x: 85, y: 48, rotate: -2 },
  },
];

export default function ScrollCutsSeparation() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinViewportRef = useRef<HTMLDivElement | null>(null);
  const cutsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centerHubRef = useRef<HTMLDivElement | null>(null);

  const [selectedCut, setSelectedCut] = useState<CutDetail>(CUTS[0]);

  // GSAP ScrollTrigger Integration for Desktop with Reduced Motion check
  useEffect(() => {
    // Check reduced motion preference or screen size
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.innerWidth >= 1024;

    if (prefersReduced || !isDesktop) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const pinViewport = pinViewportRef.current;
    const centerHub = centerHubRef.current;

    if (!container || !pinViewport || !centerHub) return;

    const ctx = gsap.context(() => {
      // Master timeline pinned across scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "+=1500",
          scrub: 1,
          pin: pinViewport,
          anticipatePin: 1,
        },
      });

      // Stage 1: Central whole chicken dims and scales back slightly as separation begins
      tl.to(centerHub, {
        scale: 0.82,
        opacity: 0.35,
        filter: "blur(1px)",
        duration: 0.35,
        ease: "power2.out",
      });

      // Stage 2: 4 distinct cut cards translate outward into non-overlapping corner positions
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
            duration: 0.75,
            ease: "power3.out",
          },
          0.15
        );
      });
    }, container);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section ref={containerRef} className="relative bg-black-deep text-white border-t border-black-border">
      {/* Viewport that gets pinned by ScrollTrigger on desktop */}
      <div
        ref={pinViewportRef}
        className="min-h-screen w-full flex flex-col justify-between py-12 px-6 lg:px-12 relative overflow-hidden"
      >
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto z-10 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950/80 border border-brand-800 text-brand-500 text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span className="uppercase tracking-wider">Scroll-Driven Anatomy</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
            Anatomy of Freshness: The Cut Separation
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-black-muted">
            <span className="lg:hidden">
              Inspect the four primary cuts portioned from a whole dressed chicken.
            </span>
            <span className="hidden lg:inline">
              Scroll down to see the central whole dressed chicken separate into individual culinary cuts.
            </span>
          </p>
        </div>

        {/* DESKTOP VIEWPORT: Whole Chicken Center + GSAP Exploded Separation */}
        <div className="hidden lg:flex relative flex-1 w-full max-w-7xl mx-auto items-center justify-center my-6 min-h-[580px]">
          {/* Center Anchor: The Actual Whole Dressed Chicken Image */}
          <div
            ref={centerHubRef}
            className="absolute z-0 w-72 h-72 rounded-2xl border-2 border-brand-800/60 bg-black-surface overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center p-2 backdrop-blur-sm pointer-events-none transition-all"
          >
            <div className="relative w-full h-full rounded-xl overflow-hidden">
              <Image
                src="/assets/images/whole-dressed-center.jpg"
                alt="Complete whole dressed chicken prior to butchering"
                fill
                sizes="280px"
                className="object-cover object-center filter contrast-[1.05]"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black-deep/90 via-transparent to-transparent" />
              <div className="absolute bottom-3 inset-x-2 text-center">
                <span className="text-xs font-bold text-white uppercase tracking-wider block">
                  Whole Dressed Chicken
                </span>
                <span className="text-[10px] text-brand-500 font-medium">Before Cut Separation</span>
              </div>
            </div>
          </div>

          {/* 4 Distinct Anatomical Cut Cards */}
          <div className="relative w-full h-full min-h-[540px] flex items-center justify-center pointer-events-none">
            {CUTS.map((cut, index) => (
              <div
                key={cut.id}
                ref={(el) => {
                  cutsRefs.current[index] = el;
                }}
                className="absolute z-10 w-64 sm:w-72 rounded-2xl bg-black-surface/95 border border-black-border hover:border-brand-600/80 p-3.5 shadow-2xl backdrop-blur-md pointer-events-auto transition-colors"
                style={{
                  // Initial position before scroll
                  opacity: 0.9,
                  transform: "scale(0.96)",
                }}
              >
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-2.5 border border-black-border bg-black-deep">
                  <Image
                    src={cut.imageSrc}
                    alt={cut.name}
                    fill
                    sizes="280px"
                    className="object-cover object-center"
                  />
                  <div className="absolute top-2 left-2 bg-black-deep/85 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-brand-500 uppercase border border-brand-900">
                    {cut.anatomyTag}
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <h4 className="text-sm font-bold text-white flex items-center justify-between">
                    <span>{cut.name}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-brand-500" />
                  </h4>

                  <p className="text-[11px] text-black-muted leading-relaxed line-clamp-2">
                    {cut.butcherNote}
                  </p>

                  <div className="pt-2 border-t border-black-border flex items-center justify-between text-[10px]">
                    <span className="text-white-off/90 font-medium flex items-center gap-1">
                      <Scale className="w-3 h-3 text-brand-500" />
                      {cut.meatType}
                    </span>
                    <span className="text-brand-500 font-medium flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {cut.cookingStyle.split(",")[0]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOBILE FALLBACK: Whole Chicken Anchor + Interactive Cut Selector */}
        <div className="block lg:hidden my-6 max-w-xl mx-auto w-full space-y-5">
          {/* Whole Chicken Center Anchor on Mobile */}
          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-brand-800/60 bg-black-surface">
            <Image
              src="/assets/images/whole-dressed-center.jpg"
              alt="Whole dressed chicken before separation"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black-deep via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Whole Dressed Chicken</span>
                <span className="text-[10px] text-brand-500 font-medium">Portions into 4 Primary Cuts</span>
              </div>
            </div>
          </div>

          {/* Cut Selection Tabs */}
          <div className="flex flex-wrap gap-2 justify-center">
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
                  aria-pressed={isActive}
                >
                  {cut.name}
                </button>
              );
            })}
          </div>

          {/* Selected Cut Detail Card */}
          <div className="bg-black-surface border border-brand-800/60 rounded-2xl p-4 shadow-xl">
            <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden mb-3 border border-black-border bg-black-deep">
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

            <h4 className="text-lg font-bold text-white mb-0.5">{selectedCut.name}</h4>
            <p className="text-xs text-brand-500 font-medium mb-2">{selectedCut.meatType}</p>
            <p className="text-xs text-black-muted mb-3 leading-relaxed">
              {selectedCut.butcherNote}
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-black-border text-xs">
              <div className="p-2 rounded-lg bg-black-deep border border-black-border">
                <span className="text-[10px] text-black-muted block uppercase">Cut Character</span>
                <span className="text-white-off font-semibold">{selectedCut.meatType}</span>
              </div>
              <div className="p-2 rounded-lg bg-black-deep border border-black-border">
                <span className="text-[10px] text-black-muted block uppercase">Recommended For</span>
                <span className="text-brand-500 font-semibold">{selectedCut.cookingStyle}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Clean Cartilage Note */}
        <div className="max-w-4xl mx-auto w-full pt-4 border-t border-black-border text-center flex flex-wrap items-center justify-between text-xs text-black-muted gap-2 z-10">
          <span className="flex items-center gap-1.5 text-white-off/80">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Separated Along Natural Joint Cartilage &bull; Clean Cuts
          </span>
          <span className="font-mono text-brand-500">A1 Butchery Preparation</span>
        </div>
      </div>
    </section>
  );
}
