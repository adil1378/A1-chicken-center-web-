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
  quadrant: "top-left" | "bottom-left" | "top-right" | "bottom-right";
  initialOffset: { x: number; y: number };
}

const CUTS: CutDetail[] = [
  {
    id: "breast-fillet",
    name: "Boneless Breast Fillet",
    anatomyTag: "Breast Cut",
    imageSrc: "/assets/images/boneless-breast.jpg",
    meatType: "Lean Skinless White Meat",
    cookingStyle: "Tandoori Tikka, Grills, Stir-Fries",
    butcherNote: "Carved clean of excess skin and fat for quick-cooking recipes.",
    quadrant: "top-left",
    initialOffset: { x: 50, y: 30 },
  },
  {
    id: "drumstick-leg",
    name: "Fresh Drumstick Cut",
    anatomyTag: "Lower Leg Quarter",
    imageSrc: "/assets/images/drumstick-cut.jpg",
    meatType: "Juicy Dark Meat on Bone",
    cookingStyle: "Dum Biryani, Slow Gravies, Roasts",
    butcherNote: "Separated along natural cartilage joints to keep bone ends intact.",
    quadrant: "bottom-left",
    initialOffset: { x: 50, y: -30 },
  },
  {
    id: "joint-cuts",
    name: "Bone-in Joint Cuts",
    anatomyTag: "Wing & Back Joints",
    imageSrc: "/assets/images/whole-carving.jpg",
    meatType: "Skin-on Mixed Cuts",
    cookingStyle: "Slow-Braised Curries, Broths",
    butcherNote: "Portioned along natural joints for traditional bone-in curries.",
    quadrant: "top-right",
    initialOffset: { x: -50, y: 30 },
  },
  {
    id: "curry-cubes",
    name: "Uniform Curry Pieces",
    anatomyTag: "Diced Cuts",
    imageSrc: "/assets/images/diced-cubes.jpg",
    meatType: "Bite-Sized Tender Cubes",
    cookingStyle: "Home Curries, Handi, Korma",
    butcherNote: "Portioned into consistent bite-sized pieces for even cooking in gravies.",
    quadrant: "bottom-right",
    initialOffset: { x: -50, y: -30 },
  },
];

export default function ScrollCutsSeparation() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pinViewportRef = useRef<HTMLDivElement | null>(null);
  const cutsRefs = useRef<(HTMLDivElement | null)[]>([]);
  const centerHubRef = useRef<HTMLDivElement | null>(null);

  const [selectedCut, setSelectedCut] = useState<CutDetail>(CUTS[0]);
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(false);

  // Setup GSAP with dynamic resize and reduced motion handling
  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsReducedMotion(e.matches);
    };

    updateMotion(motionQuery);
    motionQuery.addEventListener("change", updateMotion);

    return () => {
      motionQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  useEffect(() => {
    // If reduced motion is active or small screen, do not initialize ScrollTrigger pin
    if (isReducedMotion) return;

    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;
    if (!isDesktop) return;

    gsap.registerPlugin(ScrollTrigger);

    const container = containerRef.current;
    const pinViewport = pinViewportRef.current;
    const centerHub = centerHubRef.current;

    if (!container || !pinViewport || !centerHub) return;

    let ctx: gsap.Context | null = null;

    const initAnimation = () => {
      ctx = gsap.context(() => {
        // Set initial state: Central chicken visible, cards positioned with opacity 0
        gsap.set(centerHub, { scale: 1, opacity: 1 });
        cutsRefs.current.forEach((card, index) => {
          if (!card) return;
          const { x, y } = CUTS[index].initialOffset;
          gsap.set(card, { opacity: 0, scale: 0.88, x, y });
        });

        // Master pinned scrub timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: "+=1400",
            scrub: 1,
            pin: pinViewport,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 1. Center chicken dims and scales down slightly as separation begins
        tl.to(
          centerHub,
          {
            scale: 0.82,
            opacity: 0.3,
            duration: 0.4,
            ease: "power2.out",
          },
          0
        );

        // 2. Each cut card reveals and glides to its quadrant position (x:0, y:0 relative to its quadrant anchor)
        cutsRefs.current.forEach((card) => {
          if (!card) return;
          tl.to(
            card,
            {
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            0.15
          );
        });
      }, container);
    };

    initAnimation();

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        if (ctx) ctx.revert();
      } else {
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (ctx) ctx.revert();
    };
  }, [isReducedMotion]);

  return (
    <section id="cuts-separation" ref={containerRef} className="relative bg-black-deep text-white border-t border-black-border">
      {/* Pinned Desktop Viewport */}
      <div
        ref={pinViewportRef}
        className="min-h-screen w-full flex flex-col justify-between py-10 px-6 lg:px-12 relative overflow-hidden"
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
              Inspect the primary cuts portioned from a whole dressed chicken.
            </span>
            <span className="hidden lg:inline">
              Scroll down to see the whole dressed chicken separate into culinary cuts.
            </span>
          </p>
        </div>

        {/* DESKTOP VIEWPORT (Screen >= 1024px): Four Quadrants with Center Whole Chicken */}
        <div className="hidden lg:block relative flex-1 w-full max-w-7xl mx-auto my-4 min-h-[580px]">
          {/* 1. Center Anchor: Whole Dressed Chicken (Unobstructed at origin) */}
          <div
            ref={centerHubRef}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 w-64 h-64 xl:w-72 xl:h-72 rounded-2xl border-2 border-brand-800/70 bg-black-surface overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center p-2 backdrop-blur-sm pointer-events-none transition-transform"
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
                <span className="text-[10px] text-brand-500 font-medium">Starting Cut</span>
              </div>
            </div>
          </div>

          {/* 2. Four Individual Quadrant Cut Cards (Positioned with explicit margins, never overlapping center) */}
          {/* Top-Left Quadrant */}
          <div
            ref={(el) => {
              cutsRefs.current[0] = el;
            }}
            className="absolute top-4 left-4 xl:left-8 z-10 w-64 xl:w-72 rounded-2xl bg-black-surface/95 border border-black-border hover:border-brand-600/80 p-3.5 shadow-2xl backdrop-blur-md transition-colors"
          >
            <CutCardContent cut={CUTS[0]} />
          </div>

          {/* Bottom-Left Quadrant */}
          <div
            ref={(el) => {
              cutsRefs.current[1] = el;
            }}
            className="absolute bottom-4 left-4 xl:left-8 z-10 w-64 xl:w-72 rounded-2xl bg-black-surface/95 border border-black-border hover:border-brand-600/80 p-3.5 shadow-2xl backdrop-blur-md transition-colors"
          >
            <CutCardContent cut={CUTS[1]} />
          </div>

          {/* Top-Right Quadrant */}
          <div
            ref={(el) => {
              cutsRefs.current[2] = el;
            }}
            className="absolute top-4 right-4 xl:right-8 z-10 w-64 xl:w-72 rounded-2xl bg-black-surface/95 border border-black-border hover:border-brand-600/80 p-3.5 shadow-2xl backdrop-blur-md transition-colors"
          >
            <CutCardContent cut={CUTS[2]} />
          </div>

          {/* Bottom-Right Quadrant */}
          <div
            ref={(el) => {
              cutsRefs.current[3] = el;
            }}
            className="absolute bottom-4 right-4 xl:right-8 z-10 w-64 xl:w-72 rounded-2xl bg-black-surface/95 border border-black-border hover:border-brand-600/80 p-3.5 shadow-2xl backdrop-blur-md transition-colors"
          >
            <CutCardContent cut={CUTS[3]} />
          </div>
        </div>

        {/* MOBILE FALLBACK (Screen < 1024px or Reduced Motion): Clean, Independent, Usable */}
        <div className="block lg:hidden my-6 max-w-xl mx-auto w-full space-y-5">
          {/* Whole Chicken Visual */}
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
                <span className="text-[10px] text-brand-500 font-medium">Select a cut to inspect:</span>
              </div>
            </div>
          </div>

          {/* Cut Selection Tabs */}
          <div className="flex flex-wrap gap-2 justify-center" role="tablist" aria-label="Chicken cut selector">
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
                  role="tab"
                  aria-selected={isActive}
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

        {/* Bottom Note */}
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

function CutCardContent({ cut }: { cut: CutDetail }) {
  return (
    <>
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
    </>
  );
}
